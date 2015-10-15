'use strict';

angular.module('webethApp')
  .controller('WalletsCtrl', function ($scope) {
    $scope.message = 'Hello';
    
    $scope.wallets = function() {
      return [{
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
        }]
    }
  });
