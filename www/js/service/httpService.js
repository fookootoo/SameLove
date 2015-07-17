angular.module('starter.services.httpService',['angular-cache','ionic', 'toaster'])
    .service('HttpService',['$http','$q','CacheFactory','$ionicLoading', '$location', 'toaster','errorMessages',function($http,$q,CacheFactory,$ionicLoading,$location,toaster,errorMessages){
        var HttpService = {
            _csrf: ''
        };

        const DEFINED_CACHE_CONFIG = [
            [5000],
            [15000],
            [30000],
            [60000],
            [30000],
            [600000],
            [1200000],
            [1800000],
            [36000000]
        ];
        for (var i = 1; i <= DEFINED_CACHE_CONFIG.length; i++) {
            CacheFactory('httpDataCache' + i, {
                maxAge: DEFINED_CACHE_CONFIG[i - 1][0], // Items added to this cache expire after several seconds.
                cacheFlushInterval: 3600000, // This cache will clear itself every hour.
                deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
            });
        }

        /**
         * 对ionic loading进行简单封装
         * @type {{show: show, hide: hide}}
         */
        var uiLoading = {
            show: function () {
                $ionicLoading.show({
                    template: '加载中...',
                    noBackdrop: true,
                    duration: 30000 // 30 sec
                });
                return;
            },
            hide: function () {
                $ionicLoading.hide();
            }
        };

        /**
         * 错误处理
         * @param res {Object}
         * @private
         */
        var _errorHandler = function (res) {
            toaster.pop('warning', '呃，出错啦', errorMessages[res.error.code]);
            switch (res.error.code) {
                case 1001:
                    // 若用户未登录，跳转到登录页
                    $location.path('/login');
                    break;
                default:
                    break;
            }
        };
        HttpService.get = function (uri, params, cacheType) {
            var deferred = $q.defer();
            var httpConfig = {
                method: 'GET',
                url: uri,
                params: params,
                responseType: 'json'
            };

            // 设置缓存时长类型
            if (cacheType) {
                cacheType = parseInt(cacheType);
                if (cacheType <= 9 && cacheType >= 1) {
                    httpConfig.cache = CacheFactory.get('httpDataCache' + cacheType);
                }
            }

            $http(httpConfig).success(function (res) {
                deferred.resolve(res);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        HttpService.doPost = function (uri, params) {
            var deferred = $q.defer();
            //alert(uri);
            $http({
                method: 'POST',
                url: uri,
                params: params

            }).success(function (res) {
                //alert("doPost返回结果了"+res);
                deferred.resolve(res);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * GET: 附加UI响应(包含错误响应)
         * @param uri {String}
         * @param params {Object}
         * @param cacheType {Number} 缓存类型，如果不缓存，null/false
         * @returns {promise|*}
         */
        HttpService.getWithUi = function (uri, params, cacheType) {
            var deferred = $q.defer();
            uiLoading.show();
            this.get(uri, params, cacheType).then(function (res) {
                uiLoading.hide();
                // 请求成功， 但是需求判断status， 判定操作是否成功
                if (res.status === 1) {
                    deferred.resolve(res.data);
                } else {
                    _errorHandler(res);
                    deferred.reject(res);
                }
            }, function (error) {
                uiLoading.hide();
                // 请求失败， 为网络错误
                toaster.pop('error', '网络错误', '请求失败');
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /**
         * POST: 附加UI响应(包含错误响应)
         * @param uri {String}
         * @param params {Object}
         * @returns {promise|*}
         */
        HttpService.postWithUi = function (uri, params) {
            var deferred = $q.defer();
            uiLoading.show();
            this.doPost(uri, params).then(function (res) {
                //alert("返回结果了"+res.msg);
                uiLoading.hide();
                // 请求成功， 但是需求判断status， 判定操作是否成功
                if (res.msg == 'succ') {
                    deferred.resolve(res);
                } else {
                    _errorHandler(res);

                    deferred.reject(res);
                }
            }, function (error) {
                uiLoading.hide();
                // 请求失败， 为网络错误
                toaster.pop('error', '网络错误', '请求失败');
                deferred.reject(error);
            });
            return deferred.promise;
        };

        return HttpService;
    }]);