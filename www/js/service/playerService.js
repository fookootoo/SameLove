angular.module('starter.services.playerService',['starter.services.httpService'])
    .service('Playlist', ['$http', '$q', function ($http, $q) {
        return {get: function (params) {
            var deferred = $q.defer();

            var req = {
                method: 'GET',
                url: 'http://hypem.com/playlist/' + params.playlist + '/all/json/' + params.pagenum + '/data.json',
                headers: {
                    'X-Auth-Token': undefined,
                    'Authorization': undefined
                }
            };
            $http(req)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function(data){
                    deferred.reject(data);
                });
            return deferred.promise;
        }};
    }])

    .service('Media', ['$http', '$q', function ($http, $q) {
        return {get: function (id) {
            var deferred = $q.defer();
            var req = {
                method: 'GET',
                url: 'http://hypem-server.herokuapp.com/?mediaid=' + id,
                headers: {
                    'X-Auth-Token': undefined,
                    'Authorization': undefined
                }
            };
            $http(req)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (e) {
                    deferred.reject(e);
                });
            return deferred.promise;
        }};
    }])

    .service('Async', ['$window', function ($window) {
        return $window.async;
    }])