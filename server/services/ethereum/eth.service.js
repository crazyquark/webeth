'use strict'

var debug = require('debug')('Contracts');
var path = require('path');
var fs = require('fs');
var web3 = require('web3');

function initWeb3() {
	web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
}

function prepareForTransaction(acc, secret) {
	secret = secret || 'secret';
	
	var unlock = web3.personal.unlockAccount(acc, 'secret');
	if (!web3.eth.mining) {
		web3.miner.start(1);
	}
	
	return unlock;
}

var EthService = {
	processContractSource: function (fileData, callback) {
		//{ fieldname: 'file', originalname: 'robots.txt', encoding: '7bit', mimetype: 'text/plain', destination: 'uploads/', 
		//filename: 'da96e132f4f5050f7a37658d48b9f4dd', path: 'uploads/da96e132f4f5050f7a37658d48b9f4dd', size: 31 }
		var contractName = fileData.originalname;
		var sourceFile = path.normalize(__dirname + '/../../../' + fileData.path);

		fs.readFile(sourceFile, 'utf8', function (err, data) {
			if (err) throw err;
			debug('file: ' + data);
			var compiled = web3.eth.compile.solidity(data);
			debug(compiled);

			if (callback) {
				callback(compiled);
			}

			fs.unlink(sourceFile);
		});

		debug(contractName);
		debug(sourceFile);
	},
	createContract: function (compiled, callback) {
		// let's assume that coinbase is our account
		var acc = web3.eth.coinbase;
		web3.eth.defaultAccount = acc;
		
		// XXX: hardcoded contract name!!
		var code = compiled.greeter.code;
		// contract json abi, this is autogenerated using solc CLI
		var abi = compiled.greeter.info.abiDefinition;

		try {
			var unlock = prepareForTransaction(acc);
			if (unlock) {
				var estimate = web3.eth.estimateGas({from: acc, data: code});
				web3.eth.contract(abi).new({ data: code, gas: estimate * 2 }, function (err, contract) {
					if (err) {
						console.error(err);
						if (callback) {
							callback(err);
						}
						return;
						// callback fires twice, we only want the second call when the contract is deployed
					} else if (contract.address) {
						//$scope.contract = contract;
						//console.log('address: ' + $scope.contract.address);
						// document.getElementById('status').innerText = 'Mined!';
						// document.getElementById('call').style.visibility = 'visible';
						if (callback) {
							callback(contract);
						}
					}
				});
			}
		} catch (err) {
			debug(err);
			if (callback) {
				callback(err);
			}
		}
	},
};

initWeb3();

module.exports = EthService;