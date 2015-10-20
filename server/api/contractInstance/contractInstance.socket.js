/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ContractInstance = require('./contractInstance.model');
var mongoose = require('mongoose');

exports.register = function(socket) {
  socket.on('list_instances', function (contractId) {
    ContractInstance.findQ({contractId: mongoose.Types.ObjectId(contractId)}).then(function (instances) {
      socket.emit('post:list_instances', instances);
    }, function (err) {
      socket.emit('post:list_instances', false);
    });
  });
}