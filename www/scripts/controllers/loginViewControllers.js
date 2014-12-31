var loginViewControllers = angular.module('loginViewControllers', []);

loginViewControllers.controller('LoginViewCtrl', ['$scope', 'apiFactory', 'refreshInputForms', 'Facebook', "globalFactory", "$location",
  function($scope, apiFactory, refreshInputForms, Facebook, glob, $location) {
    refreshInputForms();

    $scope.loginWithFB = function() {
      Facebook.login({scope: 'public_profile,email'})
      .then(function(res) {
        apiFactory.user.authenticateFB(res.authResponse.userID, res.authResponse.accessToken)
          .then(function(data) {
            if (data.need_signup === true) {
              // the user is authenticated on facebook but don't exists in our app
              glob.set("forRegisterUser", data.user);
              $location.path('/registerUser');
            } else {
              apiFactory.setToken(data.token.token, true);
              apiFactory.setUser(data.user);
              $location.path('/');
            }
          });
      });
    };
  }
]);

loginViewControllers.controller("LogInFormCtrl", ['$scope', '$location', 'apiFactory', function($scope, $location, apiFactory) {
  $scope.submitLogIn = function(isValid) {
    $scope.submitted = true;
    if (isValid) {
      apiFactory.user.authenticate($scope.loginInputEmail, $scope.loginInputPassword)
        .then(function(data) {
          apiFactory.setToken(data.token.token, $scope.loginInputRemember);
          apiFactory.setUser(data.user);
          $location.path('/');
        }, function(data) {
          $scope.badPassword = true;
          apiFactory.logout();
        });
    }
  };
}]);
