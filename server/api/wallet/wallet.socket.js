/**
 * An Ethereum liason service built for our needs
 */

'use strict';

var EthService = require('../../services/ethereum/eth.service');

exports.register = function (socket) {
	socket.on('list_wallets', function () {
		socket.emit('post:list_wallets', EthService.listAccounts());
	});
}
