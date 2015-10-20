/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ContractInstance = require('./contractInstance.model');
var Contract = require('../contract/contract.model');
var mongoose = require('mongoose');
var Q = require('q');

exports.register = function(socket) {
  socket.on('list_instances', function (contractId) {
    
    var contractPromise   = Contract.findOneQ({_id: mongoose.Types.ObjectId(contractId)});
    var instancesPromise  = ContractInstance.findQ({contractId: mongoose.Types.ObjectId(contractId)});
    
    Q.allSettled([contractPromise, instancesPromise]).then( function(results) {
      var contract = results[0].value;
      var instances = results[1].value;
      
      socket.emit('post:list_instances', {instances: instances, abi: contract.abi, contractName: contract.name});
    });
  });
}