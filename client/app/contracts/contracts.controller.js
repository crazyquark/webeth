'use strict';

angular.module('webethApp')
    .controller('ContractsCtrl', function ($scope, socket, uploaderService, $timeout, usSpinnerService) {
        if ($scope.contracts) {
            delete $scope.contracts;
        }

        listContracts();

        $scope.disableButtons = false;

        $scope.uploader = uploaderService;
        $scope.uploader.autoUpload = true;

        $scope.uploader.onAfterAddingFile = function (item) {
            $scope.fileName = item.file.name;
        };

        socket.socket.on('post:upload_contract', function () {
            listContracts();
            $scope.uploader.queue.pop();
        });

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
