/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var EthService = require('../../services/ethereum/eth.service');

exports.register = function (socket) {
	socket.on('list_wallets', function () {
		EthService.listAccounts(function (accounts) {
			socket.emit('post:list_wallets', accounts);
		});
	});
}
