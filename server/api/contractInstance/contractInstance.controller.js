'use strict';

var _ = require('lodash');
var ContractInstance = require('./contractInstance.model');

// Get list of contractInstances
exports.index = function(req, res) {
  ContractInstance.find(function (err, contractInstances) {
    if(err) { return handleError(res, err); }
    return res.json(200, contractInstances);
  });
};

// Get a single contractInstance
exports.show = function(req, res) {
  ContractInstance.findById(req.params.id, function (err, contractInstance) {
    if(err) { return handleError(res, err); }
    if(!contractInstance) { return res.send(404); }
    return res.json(contractInstance);
  });
};

// Creates a new contractInstance in the DB.
exports.create = function(req, res) {
  ContractInstance.create(req.body, function(err, contractInstance) {
    if(err) { return handleError(res, err); }
    return res.json(201, contractInstance);
  });
};

// Updates an existing contractInstance in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ContractInstance.findById(req.params.id, function (err, contractInstance) {
    if (err) { return handleError(res, err); }
    if(!contractInstance) { return res.send(404); }
    var updated = _.merge(contractInstance, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contractInstance);
    });
  });
};

// Deletes a contractInstance from the DB.
exports.destroy = function(req, res) {
  ContractInstance.findById(req.params.id, function (err, contractInstance) {
    if(err) { return handleError(res, err); }
    if(!contractInstance) { return res.send(404); }
    contractInstance.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}