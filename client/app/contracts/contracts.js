'use strict';

angular.module('webethApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/contracts', {
        templateUrl: 'app/contracts/contracts.html',
        controller: 'ContractsCtrl'
      });
  });
