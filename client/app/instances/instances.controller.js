'use strict';

angular.module('webethApp')
  .controller('InstancesCtrl', function ($scope, $resource, $routeParams, socket) {
    $scope.message = 'Hello';
    
    var contractId = $routeParams.id;
    
    socket.socket.on('post:list_instances', function(response) {
      $scope.instances = response.instances;
      $scope.contractName = response.contractName;
      
      try {
        var abiParsed = JSON.parse(response.abi);
        var methods = [];
        for (var key in abiParsed) {
          var abiElement = abiParsed[key];
          
          if (abiElement.type === 'function' || abiElement.type === 'constructor') {
            var isContructor = abiElement.type === 'constructor'; 
            var methodObject = {
              name: (abiElement.name ? abiElement.name : response.contractName) + '()',
              isConstructor: isContructor,
              isConstant: abiElement.constant
            };
            if (isContructor) {
              methods.splice(0, 0, methodObject); 
            } else {
              methods.push(methodObject);
            }
          }
        }
        $scope.methods = methods; 
      } catch (err) {
        $scope.methods = [];
      } 
    });
    
    socket.socket.emit('list_instances', contractId);
  });