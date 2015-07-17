angular.module('starter.services.userFactory', ['starter.services.httpService'])
    .factory('userFactory',['HttpService','$http','API_URL', function(HttpService,$http,API_URL) {
        // Might use a resource here that returns a JSON array
        return {
            getall:function(){
                return $http.get(API_URL.baseUrl+'api/authenticate');

            },
            get:function(userId){
                return $http.get(API_URL.baseUrl+'api/authenticate/'+userId);
            }
        };
    }]);