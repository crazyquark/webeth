'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WalletSchema = new Schema({
  ownerId: Schema.Types.ObjectId,
  name: String,
  address: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', WalletSchema);