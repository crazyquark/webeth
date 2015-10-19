'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;
var Q = require('q');

var ContractSchema = new Schema({
    name: String,
    compiled: String,
    abi: String,
    code: String,
    source: String
});

module.exports = mongoose.model('Contract', ContractSchema);