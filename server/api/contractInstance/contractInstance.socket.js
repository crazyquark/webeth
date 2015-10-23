/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var EthService = require('../../services/ethereum/eth.service');
var ContractInstance = require('./contractInstance.model');
var Contract = require('../contract/contract.model');
var mongoose = require('mongoose');
var Q = require('q');
var web3 = require('web3');

exports.register = function (socket) {
  socket.on('list_instances', function (contractId) {

    var contractPromise = Contract.findOneQ({ _id: mongoose.Types.ObjectId(contractId) });
    var instancesPromise = ContractInstance.findQ({ contractId: mongoose.Types.ObjectId(contractId) });

    Q.allSettled([contractPromise, instancesPromise]).then(function (results) {
      var contract = results[0].value;
      var instances = results[1].value;

      socket.emit('post:list_instances', { instances: instances, abi: contract.abi, contractName: contract.name });
    });
  });

  socket.on('call_method', function (params) {

    var instanceId = params.instanceId;
    var methodName = params.methodName;
    var callParams = params.params;
     
    EthService.callContractMethodQ(instanceId, methodName, callParams).then(function (response) {
      socket.emit('post:call_method', response);
    }, function (err) {
      socket.emit('error:call_method', err);
    });
  });
}