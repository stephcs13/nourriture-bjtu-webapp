var loginViewControllers = angular.module('loginViewControllers', []);

loginViewControllers.controller('LoginViewCtrl', ['$scope', 'apiFactory',
  function($scope, apiFactory) {
  }
]);

loginViewControllers.controller("LogInFormCtrl", ['$scope', '$location', 'ipCookie', 'apiFactory', function($scope, $location, ipCookie, apiFactory) {
  $scope.submitLogIn = function(isValid) {
    $scope.submitted = true;
    if (isValid) {
      apiFactory.user.authenticate($scope.loginInputEmail, $scope.loginInputPassword)
        .then(function(data) {
          apiFactory.setToken(data.token);
          apiFactory.setUser(data.user);
          ipCookie("token", data.token, {expirationUnit: 'hours', expires: 240});
          $location.path('/');
        }, function(data) {
          $scope.badPassword = true;
          ipCookie.remove("token");
        });
    }
  };
}]);
