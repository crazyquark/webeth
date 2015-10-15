'use strict';

angular.module('webethApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/wallets', {
        templateUrl: 'app/wallets/wallets.html',
        controller: 'WalletsCtrl'
      });
  });
