'use strict';

var _ = require('lodash');

var Contract = require('./contract.model');
var EthService = require('../../services/ethereum/eth.service');
var Q = require('q');

// Upload a contract source code
exports.upload = function (req, res) {
  EthService.processContractSource(req.file).then(function (compiledCode) {
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
        return handleError(res, err.messsage);
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
      
      res.json(contractValues);
    },
    function(err) {
      handleError(res, err);
    });
  },
  function(err) {
    handleError(err, res);
  });
}

// Get list of contracts
exports.index = function (req, res) {
  Contract.find(function (err, contracts) {
    if (err) { return handleError(res, err); }
    return res.json(200, contracts);
  });
};

// Get a single contract
exports.show = function (req, res) {
  Contract.findById(req.params.id, function (err, contract) {
    if (err) { return handleError(res, err); }
    if (!contract) { return res.send(404); }
    return res.json(contract);
  });
};

// Creates a new contract in the DB.
exports.create = function (req, res) {
  Contract.create(req.body, function (err, contract) {
    if (err) { return handleError(res, err); }
    return res.json(201, contract);
  });
};

// Updates an existing contract in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Contract.findById(req.params.id, function (err, contract) {
    if (err) { return handleError(res, err); }
    if (!contract) { return res.send(404); }
    var updated = _.merge(contract, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contract);
    });
  });
};

// Deletes a contract from the DB.
exports.destroy = function (req, res) {
  Contract.findById(req.params.id, function (err, contract) {
    if (err) { return handleError(res, err); }
    if (!contract) { return res.send(404); }
    contract.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}