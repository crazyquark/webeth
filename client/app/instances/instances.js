'use strict';

angular.module('webethApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/instances', {
        templateUrl: 'app/instances/instances.html',
        controller: 'InstancesCtrl'
      });
  });
