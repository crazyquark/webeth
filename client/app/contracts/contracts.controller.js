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
        }
    });
