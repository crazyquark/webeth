'use strict';

describe('Controller: InstancesCtrl', function () {

  // load the controller's module
  beforeEach(module('webethApp'));

  var InstancesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InstancesCtrl = $controller('InstancesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
