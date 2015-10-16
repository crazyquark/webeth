'use strict'

var debug = require('debug')('Contracts')
var path = require('path');

var EthService = {
	processContractSource: function (fileData) {
		//{ fieldname: 'file', originalname: 'robots.txt', encoding: '7bit', mimetype: 'text/plain', destination: 'uploads/', 
		//filename: 'da96e132f4f5050f7a37658d48b9f4dd', path: 'uploads/da96e132f4f5050f7a37658d48b9f4dd', size: 31 }
		var contractName = fileData.originalname;
		var sourceFile = path.normalize(__dirname + '/../../../' + fileData.path);
		
		debug(contractName);
		debug(sourceFile);
	}
};

module.exports = EthService;