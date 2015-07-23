angular.module('starter.controllers',[])
    .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'You are not allowed to access this resource.'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            AuthService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Session Lost!',
                template: 'Sorry, You have to login again.'
            });
        });

        $scope.setCurrentUsername = function(name) {
            $scope.username = name;
        };
    })

    .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
        $scope.data = {};

        $scope.login = function(data) {
            AuthService.login(data.username, data.password).then(function(authenticated) {
                $state.go('main.dash', {}, {reload: true});
                $scope.setCurrentUsername(data.username);
            }, function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        };
    })
    .controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService,API_URL) {
        /*$scope.logout = function() {
            AuthService.logout();
            $state.go('login');
        };

        $scope.performValidRequest = function() {


         $http.get(API_URL.baseUrl+'/api/authenticate').then(
                function(result) {
                    //alert(result);
                    $scope.response = result;
                }, function(err) {
                 //alert(err);
                    $scope.response = err;
                });
        };

        $scope.performUnauthorizedRequest = function() {
            $http.get('http://localhost:8100/notauthorized').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };

        $scope.performInvalidRequest = function() {
            $http.get('http://localhost:8100/notauthenticated').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };*/

        //alert('here');
        var iframeWidth = 'width:' + document.body.clientWidth + 'px;';
        var iframeHeight = 'height:' + (document.body.scrollHeight - (ionic.Platform.isIOS()? 60 : 45)) + 'px;';
        $scope.iframeStyle = iframeHeight + iframeWidth + 'margin-bottom: 0;';
        $scope.mapDivStyle=iframeHeight + 'margin-bottom: 0;';
        $scope.mapCampus = 'templates/map/demoMap.html';

    })
    .controller('PlayerCtrl',
    ['$scope','Playlist', '$routeParams', '$document', 'Media', '$window', 'Async',
        function ($scope, Playlist, $routeParams, $document, Media, $window, Async) {
            var addToQueue = function(songs, cb) {
                var pending = [];
                for (var key in songs) {
                    if (songs.hasOwnProperty(key) && angular.isObject(songs[key])) {
                        pending.push(songs[key]);
                    }
                }

                Async.map(pending, function (song, callback) {
                    Media.get(song.mediaid).then(function (media) {
                        song.url = media.url;
                        callback(null, song);
                    }).catch (function (e) {
                        callback(e);
                    });
                }, function (e, mutated) {
                    queue = queue.concat(mutated);
                    cb();
                });
            };

            var getPlaylist = function (cb) {
                Playlist.get({playlist: $routeParams.playlist || 'popular', pagenum: currentPage}).then(function(songs) {
                    currentPage++;
                    addToQueue(songs, function () {
                        cb();
                    });
                }).catch(function(e) {
                    cb();
                });
            };

            $scope.playerControl = function () {
                if (!$scope.isPlaying) {
                    if (audio.getAttribute('src') === null) {
                        setPlayer();
                    }
                    audio.play();
                    $scope.isPlaying = true;
                } else {
                    audio.pause();
                    $scope.isPlaying = false;
                }
            };

            $scope.nextSong = function () {
                currentSongIdx++;
                setPlayer();
                audio.play();
                $scope.isPlaying = true;
                if (currentSongIdx > 0 && currentSongIdx % 20 === 0) {
                    getPlaylist(function () {
                        console.log('updated!');
                    });
                }
            };

            $scope.previousSong = function () {
                if (currentSongIdx > 0 ) {
                    currentSongIdx--;
                    setPlayer();
                    audio.play();
                    $scope.isPlaying = true;
                }
            };

            var setPlayer = function () {
                console.log(queue[currentSongIdx]);
                $scope.ArtistImage = queue[currentSongIdx].thumb_url_artist;
                $scope.ArtistName = queue[currentSongIdx].artist;
                $scope.SongName = queue[currentSongIdx].title;
                $scope.Cover = queue[currentSongIdx].thumb_url_large;
                audio.src = queue[currentSongIdx].url;
            };

            $scope.ArtistImage = null;
            $scope.ArtistName = null;
            $scope.SongName = null;
            $scope.Cover = null;
            $scope.isPlaying = false;
            var currentSongIdx = 0;
            var queue = [];
            var currentPage = 1;
            var audio = $window.document.getElementById('player');
            //init
            getPlaylist(function () {
                $scope.playerControl();
            });

            audio.addEventListener('ended', function () {
                $scope.$apply($scope.nextSong());
            });


        }]);