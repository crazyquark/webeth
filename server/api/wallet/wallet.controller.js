'use strict';

var _ = require('lodash');
var Wallet = require('./wallet.model');

// Get list of wallets
exports.index = function(req, res) {
  Wallet.find(function (err, wallets) {
    if(err) { return handleError(res, err); }
    return res.json(200, wallets);
  });
};

// Get a single wallet
exports.show = function(req, res) {
  Wallet.findById(req.params.id, function (err, wallet) {
    if(err) { return handleError(res, err); }
    if(!wallet) { return res.send(404); }
    return res.json(wallet);
  });
};

// Creates a new wallet in the DB.
exports.create = function(req, res) {
  Wallet.create(req.body, function(err, wallet) {
    if(err) { return handleError(res, err); }
    return res.json(201, wallet);
  });
};

// Updates an existing wallet in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Wallet.findById(req.params.id, function (err, wallet) {
    if (err) { return handleError(res, err); }
    if(!wallet) { return res.send(404); }
    var updated = _.merge(wallet, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, wallet);
    });
  });
};

// Deletes a wallet from the DB.
exports.destroy = function(req, res) {
  Wallet.findById(req.params.id, function (err, wallet) {
    if(err) { return handleError(res, err); }
    if(!wallet) { return res.send(404); }
    wallet.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}