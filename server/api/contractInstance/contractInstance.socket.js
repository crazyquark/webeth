/**
 * Broadcast updates to client when the model changes
 */

'use strict';

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

    var errorHandle = function (err) {
      socket.emit('error:call_method', err);
    };

    var instancePromise = ContractInstance.findOneQ({ _id: mongoose.Types.ObjectId(instanceId) });
    
    instancePromise.then(function (instance) {
      var contractPromise = Contract.findOneQ({ _id: mongoose.Types.ObjectId(instance.contractId) });

      var code = web3.eth.getCode(instance.address);
      if (code == "0x") {
        errorHandle("This contract commited suicide, you have to move on.");
        return;
      } else {

        contractPromise.then(function (contract) {
          try {
            var foundMethod = false;
            var abiParsed = JSON.parse(contract.abi);
            // search for the method inside the abi
            for (var key in abiParsed) {
              var abiElement = abiParsed[key];
              if (abiElement.type === 'function' && abiElement.name === methodName) {
                foundMethod = {
                  isMethodConstant: abiElement.constant,
                };
              }
            }

            if (foundMethod) {
              //do web3 operations
              var contractObj = web3.eth.contract(abiParsed).at(instance.address);

              if (foundMethod.isMethodConstant) {
                var response = contractObj[methodName]();
                socket.emit('post:call_method', {
                  isMethodConstant: foundMethod.isMethodConstant,
                  message: response
                });
              } else {
                var txHash = contractObj[methodName].sendTransaction({ from: web3.eth.coinbase });
                socket.emit('post:call_method', {
                  isMethodConstant: foundMethod.isMethodConstant,
                  txHash: txHash,
                });
              }
            } else {
              // method does not exist
              errorHandle('Method ' + methodName + ' does not exist!');
            }
          } catch (err) {
            errorHandle(err);
            return;
          }
        }, errorHandle);
      }
    }, errorHandle);

  });
}