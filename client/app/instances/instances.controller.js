'use strict';

angular.module('webethApp')
  .controller('InstancesCtrl', function ($scope, $resource, $routeParams, socket) {
    $scope.message = 'Hello';
    
    var contractId = $routeParams.id;
    
    socket.socket.on('post:list_instances', function(instances) {
      $scope.instances = instances; 
    });
    
    socket.socket.emit('list_instances', contractId);
  });