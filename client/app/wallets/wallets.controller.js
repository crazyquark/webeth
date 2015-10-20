'use strict';

angular.module('webethApp')
  .controller('WalletsCtrl', function ($scope, Auth, socket) {
  
    $scope.wallets = [/*{
        name: 'account A',
        address: '0xadadfsaadadada',
        timestamp: '05-10-2015',
        balance: '123.21'
        },
        {
        name: 'account B',
        address: '0xadadfsffffadada',
        timestamp: '05-11-2015',
        balance: '113.21'
        }*/];
        
     socket.socket.on('post:list_wallets', function(wallets) {
        $scope.wallets = wallets;
     });
     
     socket.socket.emit('list_wallets');
  });
