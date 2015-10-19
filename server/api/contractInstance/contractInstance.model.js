'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContractInstanceSchema = new Schema({
  address: String,
  transactionAddress: String,
  contractSource: Schema.Types.ObjectId
});

module.exports = mongoose.model('ContractInstance', ContractInstanceSchema);