/*!
 * angularjs-jf-contextual-spinner
 * 
 * Version: 0.0.1 - 2014-12-25T08:53:08.829Z
 * License: MIT
 */


angular.module('jf.Directives', [])

    //provider service to setup overlay configuration in the app.config - this will configure the delay and set a base animation class if necessary
    .provider('jfSpinnerConfig', function () {
        var config = {
            delay: 0,
            baseAnimationClass: undefined
        };
        this.setDelay = function (delayTime) {
            config.delay = delayTime;
        };
        this.setBaseAnimationClass = function (clazz) {
            config.baseAnimationClass = clazz;
        };
        this.$get = function () {
            function getDelayTime() {
                return config.delay;
            }
            function getBaseAnimationClass() {
                return config.baseAnimationClass;
            }
            function getConfig() {
                return config;
            }
            return {
                getDelayTime: getDelayTime,
                getBaseAnimationClass: getBaseAnimationClass,
                getConfig: getConfig
            };
        };
    })

    //Empty factory to hook into $httpProvider.interceptors. Directive will hookup request, response, and responseError interceptors
    .factory('httpInterceptor', function () {
        return {}
    })

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })

    .factory('LoaderFactory', function (httpInterceptor, $q, $timeout, $rootScope) {

        var queue = [];
        var me = {};

        me.wireUpHttpInterceptor = function () {

            httpInterceptor.request = function (config) {
                me.processRequest();
                return config || $q.when(config);
            };

            httpInterceptor.response = function (response) {
                me.processResponse();
                return response || $q.when(response);
            };

            httpInterceptor.responseError = function (rejection) {
                me.processResponse();
                return $q.reject(rejection);
            };
        };

        me.processRequest = function (coords, target) {
            me._elementObject = {};
            me._elementObject._xy = coords;
            me._elementObject._target = target;
            queue.push({});
            var deffered = $q.defer();
            deffered.resolve(function () {
                if (queue.length == 1) {
                    if (queue.length) {
                        return me._elementObject;
                    }
                }
                return me._elementObject;
            });
            return deffered.promise;
        };

        me.processResponse = function () {
            queue.pop();
            $rootScope.$emit('hideOverlay', {obj: me._elementObject});
        };

        return me;
    })

    //Directive that uses the httpInterceptor factory above to monitor XHR calls. When a call is made it displays an loading spinner icon
    .directive('jfLoader', function ($rootScope, LoaderFactory, $timeout, $document, jfSpinnerConfig) {

        LoaderFactory.wireUpHttpInterceptor();

        var template =   '<span class="svg-loader" title="0">' +
                            '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> ' +
                              '<path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>' +
                              '<path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z">' +
                              '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>' +
                              '</path>' +
                            '</svg>' +
                          '</span>';

        return {
            restrict: 'A',
            transclude: true,
            template: template + '<span class="jf-loader-innner-text" ng-transclude></span>',
            link: function (scope, element, attrs) {

                var coordinates = {}, loader, spinner, text, mousemove, mouseup, effect, $el = $(element),
                    clazzes = 'display: block !important; position: absolute; ';

                if (attrs.animateClass) {
                    effect = attrs.animateClass;
                } else {
                    effect = typeof jfSpinnerConfig.getBaseAnimationClass() !== 'undefined' ? jfSpinnerConfig.getBaseAnimationClass() : null;
                }

                mouseup = function (e) {
                    coordinates.x = e.pageX + 'px';
                    coordinates.y = e.pageY + 'px';
                    spinner = $el.find('.svg-loader');
                    text = $el.find('.jf-loader-innner-text').children();

                    if (effect) {
                        text.addClass('animated ' + effect);
                    }

                    spinner.attr('style',
                        clazzes +
                        'top: ' + coordinates.y + ' !important; ' +
                        'left: ' + coordinates.x + ' !important;'
                    );

                    LoaderFactory.processRequest(e, e.target).then(function () { showOverlay() });
                };

                element.on('click', mouseup);

                var showOverlay = function() {

                    mousemove = function mousemover(e) {
                        coordinates.x = e.pageX + 'px';
                        coordinates.y = e.pageY + 'px';
                        spinner.attr('style',
                            clazzes +
                            'top: ' + coordinates.y + ' !important; ' +
                            'left: ' + coordinates.x + ' !important;'
                        );
                    };

                    $document.on('mousemove', mousemove);
                };

                var hideOverlay = function(elobject) {

                    var context = angular.element(elobject.obj._target);
                    if(text){
                        context.parent().parent().find('.svg-loader').attr('style', 'display: none;');
                        $document.off('mousemove', mousemove);
                        if (effect) {
                            text.removeClass('animated ' + effect);
                        }
                    }
                };

                $rootScope.$on('hideOverlay', function (event, element) {
                    $timeout(function () {
                        hideOverlay(element);
                    }, typeof jfSpinnerConfig.getDelayTime() !== 'undefined' ? jfSpinnerConfig.getDelayTime() : 0);
                });
            }
        }
    })
;


