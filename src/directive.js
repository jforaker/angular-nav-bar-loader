angular.module('jf_NavBarLoader', [])

    .provider('jf_NavLoadingBarCfg', function () {

        this.loadingBarTemplate = '<div id="jf-nav-loading-bar"></div>';

        var config = {
            delay: undefined,
            baseOpacity: undefined,
            baseColor: undefined,
            loadingBarTemplate: this.loadingBarTemplate
        };

        this.setConfigs = function(opts) {
            for (var key in opts) {
                if (config.hasOwnProperty(key)) {
                    config[key] = opts[key];
                }
            }
        };

        var getConfig = function getConfig() {
            return config;
        };

        this.$get = function () {

            return {
                getConfig: getConfig
            };
        };
    })

    .factory('jf_httpInterceptor', function ($q, $rootScope) {

        var numLoadings = 0;

        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast("jf_NavBarLoader:show");
                return config || $q.when(config);
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("jf_NavBarLoader:hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("jf_NavBarLoader:hide");
                }
                return $q.reject(response);
            }
        };
    })

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('jf_httpInterceptor');
    })

    .directive('jfNavBarLoader', function (jf_NavLoadingBarCfg, $timeout) {
        return {
            link: function (scope, element, attrs) {

                var $el = $(element);
                var configs = jf_NavLoadingBarCfg.getConfig();
                var loader = angular.element(jf_NavLoadingBarCfg.getConfig().loadingBarTemplate);
                var hideDelay = typeof configs.delay !== 'undefined' ? configs.delay : 750;
                var opacity = typeof configs.baseOpacity !== 'undefined' ? configs.baseOpacity : 0.3;
                var bgColor = typeof configs.baseColor !== 'undefined' ? configs.baseColor : 'white';

                loader.css({
                    height: $el.height(),
                    width: $el.width(),
                    opacity: opacity,
                    backgroundColor: bgColor
                });

                scope.$on("jf_NavBarLoader:show", function () {
                    loader.insertBefore($el.children().first());
                    loader.css({ width: '0%' });
                    loader.show();

                    var animateWidth = function (from) {
                        if (from >= 100) {
                            return false;
                        } else {
                            loader.css({ width: from + "%" });
                            $timeout(function () {
                                animateWidth(from + 5);
                            }, 1)
                        }
                    };
                    return animateWidth(Math.floor(Math.random() * 15) + 1);
                });

                return scope.$on("jf_NavBarLoader:hide", function () {
                    loader.css({ width: '100%' });
                    $timeout(function () {
                        loader.hide();
                    }, hideDelay)
                });
            }
        };
    })
;


