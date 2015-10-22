'use strict';

angular.module('webethApp')
  .controller('InstancesCtrl', function ($scope, $resource, $routeParams, socket, usSpinnerService, $modal) {
    $scope.message = 'Hello';

    var contractId = $routeParams.id;

    socket.socket.on('post:list_instances', function (response) {
      $scope.instances = response.instances;
      $scope.contractName = response.contractName;

      try {
        var abiParsed = JSON.parse(response.abi);
        var methods = [];
        for (var key in abiParsed) {
          var abiElement = abiParsed[key];

          if (abiElement.type === 'function') {
            var isContructor = abiElement.type === 'constructor';
            var methodObject = {
              name: (abiElement.name ? abiElement.name : response.contractName),
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

    $scope.callMethodModal = function (instanceId, methodName) {

      $modal.open({
        templateUrl: 'app/instances/callMethod.html',
        backdrop: true,
        windowClass: 'modal',
        controller: function ($scope, $modalInstance) {
          $scope.methodName = methodName;
          $scope.instanceId = instanceId;
          
          $scope.callMethod = function (instanceId, methodName) {
            usSpinnerService.spin('contract-spin');

            socket.socket.on('post:call_method', function (response) {
              $modalInstance.dismiss('cancel');
              
              usSpinnerService.stop('contract-spin');
              if (response.isMethodConstant) {
                swal('Great!', 'Your call returned "' + response.message + '"', 'success');
              } else {
                swal('Great!', 'Contract updated by transaction ' + response.txHash + '!', 'success');
              }
            });

            socket.socket.on('error:call_method', function (err) {
              $modalInstance.dismiss('cancel');
              usSpinnerService.stop('contract-spin');
              console.log('error: ' + err);
              swal('Oops!', 'Your call returned "' + err + '"', 'error');
            });

            socket.socket.emit('call_method', { instanceId: instanceId, methodName: methodName });
          };
          
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
        }
      });
    };
  });