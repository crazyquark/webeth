/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ContractInstance = require('./contractInstance.model');

exports.register = function(socket) {
  ContractInstance.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ContractInstance.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('contractInstance:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('contractInstance:remove', doc);
}