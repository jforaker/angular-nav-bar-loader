/*!
 * angularjs-jf-contextual-spinner
 * 
 * Version: 0.0.1 - 2015-01-01T19:49:53.067Z
 * License: MIT
 */


angular.module('jf_NavBarLoader', [])

    .provider('jf_NavLoadingBarCfg', function () {

        this.loadingBarTemplate = '<div id="jf-nav-loading-bar"></div>';

        var config = {
            hideDelay: undefined,
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
            link: function (scope, element) {

                var $el = $(element),
                    configs = jf_NavLoadingBarCfg.getConfig(),
                    loader = angular.element(jf_NavLoadingBarCfg.getConfig().loadingBarTemplate),
                    hideDelay = typeof configs.hideDelay !== 'undefined' ? configs.hideDelay : 750,
                    opacity = typeof configs.baseOpacity !== 'undefined' ? configs.baseOpacity : 0.3,
                    bgColor = typeof configs.baseColor !== 'undefined' ? configs.baseColor : 'white';

                loader.css({
                    height: $el.height(),
                    opacity: opacity,
                    backgroundColor: bgColor
                });

                scope.$on("jf_NavBarLoader:show", function () {

                    if($el.children().length){
                        loader.insertBefore($el.children().first());
                    } else {
                        //todo: needs work
                        loader.appendTo($el);
                    }
                    loader.css({ width: '0%' });
                    loader.show();

                    console.log('loader ', loader);
                    var animateWidth = function (width) {
                        if (width >= 100) {
                            return false;
                        } else {
                            loader.css({
                                width: width + "%",
                                WebkitTransition: 'width 0.75s ease',
                                transition: 'width 0.75s ease'
                            });
                            $timeout(function () {
                                animateWidth(width + 5);
                            }, 1);
                        }
                    };
                    return animateWidth(Math.floor(Math.random() * 15) + 1);
                });

                return scope.$on("jf_NavBarLoader:hide", function () {
                    loader.css({ width: '100%' });
                    $timeout(function () {
                        loader.fadeOut('fast');
                    }, hideDelay)
                });
            }
        };
    })
;


