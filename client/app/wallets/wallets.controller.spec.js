'use strict';

describe('Controller: WalletsCtrl', function () {

  // load the controller's module
  beforeEach(module('webethApp'));

  var WalletsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WalletsCtrl = $controller('WalletsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
