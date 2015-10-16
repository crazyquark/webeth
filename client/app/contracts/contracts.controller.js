'use strict';

angular.module('webethApp')
    .controller('ContractsCtrl', function ($scope, socket, Upload, $timeout) {
        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];

            if ($scope.compiledCode) {
                delete $scope.compiledCode;
            }

            if (file) {
                file.upload = Upload.upload({
                    url: 'api/contracts',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        $scope.compiledCode = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        }

        $scope.createContract = function () {
            if (!$scope.compiledCode) {
                return;
            }
            
            // let's assume that coinbase is our account
            web3.eth.defaultAccount = web3.eth.coinbase;

            web3.eth.contract(abi).new({ data: $scope.compiledCode }, function (err, contract) {
                if (err) {
                    console.error(err);
                    return;
                    // callback fires twice, we only want the second call when the contract is deployed
                } else if (contract.address) {
                    $scope.contract = contract;
                    console.log('address: ' + $scope.contract.address);
                    // document.getElementById('status').innerText = 'Mined!';
                    // document.getElementById('call').style.visibility = 'visible';
                }
            });
        }
    });
