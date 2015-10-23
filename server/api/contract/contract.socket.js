/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ss = require('socket.io-stream');
var Q = require('q');

var Contract = require('./contract.model');
var EthService = require('../../services/ethereum/eth.service');

var debug = require('debug')('Contracts');

exports.register = function (socket) {
  socket.on('create_contract', function (contractId) {
    EthService.createContractQ(contractId).then(function (response) {
      socket.emit('post:create_contract', response);
    },
      function (err) {
        socket.emit('error:create_contract', err);
      });
  });

  socket.on('get_contracts', function () {
    return Contract.findQ().then(function (contracts) {
      socket.emit('post:get_contracts', { contracts: contracts });
    });
  });

  ss(socket).on('stream', function (stream, metadata) {
    var memStore = new Buffer('');

    debug('Got Stream with metadata: ', metadata);
    var itemHash = metadata.hash;
    var size = 0;
    var progress = 0;
    stream.on('data', function (chunk) {
      size += chunk.length;
      progress = Math.floor(size / metadata.size * 100);
      socket.emit('progress', { itemKey: itemHash, tx: progress });

      var buffer = (Buffer.isBuffer(chunk)) ?
        chunk :  // already is Buffer use it
        new Buffer(chunk, enc);  // string, convert
          
      memStore = Buffer.concat([memStore, buffer]);
    });

    stream.on('end', function () {
      debug('File uploaded successfully');
      socket.emit('upload-done', { itemKey: itemHash });

      EthService.processContractSource(memStore.toString()).then(function (compiledCode) {
        var contractPromises = [];
        for (var key in compiledCode) {
          try {
            var entry = compiledCode[key];
            var contract = {
              name: key,
              code: entry.code,
              abi: JSON.stringify(entry.info.abiDefinition),
              source: entry.source
            };

            contractPromises.push(Contract.createQ(contract));
          } catch (err) {
            socket.emit('error:upload_contract');
          }
        }

        Q.allSettled(contractPromises).then(function (contracts) {
          var contractValues = [];
          for (var key in contracts) {
            var contractSettled = contracts[key];
            contractValues.push({
              id: contractSettled.value._id,
              name: contractSettled.value.name,
              abi: contractSettled.value.abi
            });
          }

          socket.emit('post:upload_contract');
        },
          function (err) {
            socket.emit('error:upload_contract');
          });
      },
        function (err) {
            socket.emit('error:upload_contract');
        });
    })
  });
}
