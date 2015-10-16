'use strict'

var debug = require('debug')('Contracts');
var path = require('path');
var fs = require('fs');
var web3 = require('web3');

function initWeb3() {
	web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
}

var EthService = {
	processContractSource: function (fileData) {
		//{ fieldname: 'file', originalname: 'robots.txt', encoding: '7bit', mimetype: 'text/plain', destination: 'uploads/', 
		//filename: 'da96e132f4f5050f7a37658d48b9f4dd', path: 'uploads/da96e132f4f5050f7a37658d48b9f4dd', size: 31 }
		var contractName = fileData.originalname;
		var sourceFile = path.normalize(__dirname + '/../../../' + fileData.path);

		var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';
		
		var compiled = web3.eth.compile.solidity(greeterSource);

		debug(compiled);
		debug(contractName);
		debug(sourceFile);
	}
};

initWeb3();

module.exports = EthService;