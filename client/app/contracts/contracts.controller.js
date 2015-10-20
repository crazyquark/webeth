'use strict';

angular.module('webethApp')
    .controller('ContractsCtrl', function ($scope, socket, Upload, $timeout, usSpinnerService) {
        if ($scope.contracts) {
            delete $scope.contracts;
        }
        listContracts();
        
        $scope.disableButtons = false;
      
        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];

            if (file) {
                file.upload = Upload.upload({
                    url: 'api/contracts',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        listContracts();
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        }

        $scope.createContract = function (contractId) {
            usSpinnerService.spin('contract-spin');
            $scope.disableButtons = true;
            socket.socket.on('post:create_contract', function (data) {
                console.log('done: ' + data);
                if (data.success) {
                    swal("Great!", "Your contract is on the blockchain at address: " + data.success.address + "!", "success");
                } else {
                    swal("Ooops!", "Something went wrong: " + data.failure + "!", "error");
                }
                usSpinnerService.stop('contract-spin');
                $scope.disableButtons = false;
            });

            socket.socket.emit('create_contract', contractId);
        }

        function listContracts() {
            socket.socket.on('post:get_contracts', function (data) {
                if (data.contracts.length > 0) {
                    $scope.contracts = data.contracts;
                }
            });

            socket.socket.emit('get_contracts');
        }
    });
