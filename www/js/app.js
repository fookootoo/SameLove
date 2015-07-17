// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter',
    ['ionic',
        'starter.controllers',
        'starter.services.userFactory',
        'starter.services.playerService',
        'starter.services',
        'starter.controllers.user',
        'ngRoute'],
    function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); // other values: top

    }])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
    .config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
          .state('login', {
              url: '/login',
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl'
          })
          .state('main', {
              url: '/',
              abstract: true,
              templateUrl: 'templates/main.html'
          })
          .state('main.dash', {
              url: 'main/dash',
              views: {
                  'dash-tab': {
                      templateUrl: 'templates/dashboard.html',
                      controller: 'DashCtrl'
                  }
              }
          })
            .state('main.public', {
                url: 'main/public',
                views: {
                    'public-tab': {
                        templateUrl: 'templates/public.html',
                        controller: 'UserCtrl'
                    }
                }
            })
            .state('main.public-detail', {
                url: 'main/public/:userId',
                views: {
                    'public-tab': {
                        templateUrl: 'templates/user-detail.html',
                        controller: 'UserDetailCtrl'
                    }
                }
            })
            .state('main.admin', {
                url: 'main/admin',
                views: {
                    'admin-tab': {
                        templateUrl: 'templates/admin.html',
                        controller: 'PlayerCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/main/dash');

    })
    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $state.go($state.current, {}, {reload: true});
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
            }

            if (!AuthService.isAuthenticated()) {
                if (next.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });
    })
/*
    .run(function($httpBackend){
        $httpBackend.whenGET('http://localhost:8100/valid')
            .respond({message: 'This is my valid response!'});
        $httpBackend.whenGET('http://localhost:8100/notauthenticated')
            .respond(401, {message: "Not Authenticated"});
        $httpBackend.whenGET('http://localhost:8100/notauthorized')
            .respond(403, {message: "Not Authorized"});

        $httpBackend.whenGET(/templates\/\w+.*//*
).passThrough();
    })*/
