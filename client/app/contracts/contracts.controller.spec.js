'use strict';

describe('Controller: ContractsCtrl', function () {

  // load the controller's module
  beforeEach(module('webethApp'));

  var ContractsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContractsCtrl = $controller('ContractsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
