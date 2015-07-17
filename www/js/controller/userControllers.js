angular.module('starter.controllers.user',[])
    .controller('UserCtrl',function($scope,$http,userFactory) {

        userFactory.getall().success(function(res){
            //alert(res);
            console.log(JSON.stringify(res));
            $scope.users =res;
        })
        .error(function(err){
            alert(err);
        });

})
    .controller('UserDetailCtrl', function($scope, $stateParams, userFactory) {
        userFactory.get($stateParams.userId).success(function(res){
            console.log(JSON.stringify(res));
            $scope.user =res;
        })
            .error(function(err){
                alert(err)});;
    });