'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContractInstanceSchema = new Schema({
  address: String,
  transactionHash: String,
  contractId: Schema.Types.ObjectId,
  timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ContractInstance', ContractInstanceSchema);