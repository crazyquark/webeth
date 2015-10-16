/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Contract = require('./contract.model');
var EthService = require('../../services/ethereum/eth.service');

exports.register = function(socket) {
  socket.on('create_contract', function(compiledCode) {
    EthService.createContract(compiledCode, function() {
      socket.emit('post:create_contract', {status: 'success'});
    });
  });
}
