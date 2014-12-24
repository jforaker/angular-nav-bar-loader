/*!
 * angular-directive-boilerplate
 * 
 * Version: 0.0.8 - 2014-12-24T22:58:25.062Z
 * License: MIT
 */


'use strict';


angular.module('jf.Directives', [])

  //provider service to setup overlay configuration in the app.config
  //this will configure the delay and the APIs which you don't want to show overlay on
    .provider('wcOverlayConfig', function () {

      //default config
      var config = {
        delay: 500,
        exceptUrls: []
      };

      //set delay
      this.setDelay = function (delayTime) {
        config.delay = delayTime;
      };

      //set exception urls
      this.setExceptionUrls = function (urlList) {
        config.exceptUrls = urlList;
      };

      this.$get = function () {
        function getDelayTime() {
          return config.delay;
        }

        function getExceptUrls() {
          return config.exceptUrls;
        }

        function getConfig() {
          return config;
        }

        return {
          getDelayTime: getDelayTime,
          getExceptUrls: getExceptUrls,
          getConfig: getConfig
        };
      };
    })

  //Empty factory to hook into $httpProvider.interceptors
  //Directive will hookup request, response, and responseError interceptors
    .factory('httpInterceptor', function () {
      return {}
    })

  //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }])

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


      me.processRequest = function (coords) {
        me._xy = coords;
        queue.push({});
        var deffered = $q.defer();
        deffered.resolve(function () {
          if (queue.length == 1) {
            if (queue.length) {
              return me._xy;
            }
          }
          return me._xy;
        });
        return deffered.promise;
      };

      me.processResponse = function () {
        queue.pop();
        $rootScope.$emit('hideOverlay');
      };


      return me;
    })

  //Directive that uses the httpInterceptor factory above to monitor XHR calls
  //When a call is made it displays an overlay and a content area
    .directive('jfLoader', ['$rootScope','LoaderFactory', '$q', '$timeout', '$window', '$document', 'httpInterceptor', 'wcOverlayConfig', function ($rootScope, LoaderFactory, $q, $timeout, $window, $document, httpInterceptor, wcOverlayConfig) {

      LoaderFactory.wireUpHttpInterceptor();

      var link = function (scope, element, attrs) {

        $rootScope.$on('hideOverlay', function () {
          console.log('hideOverlay ');
          hideOverlay();
        });

        var coordinates = {};

        var loader, spinner, text, mousemove, mouseup;

        mouseup = function (e) {
          LoaderFactory.processRequest(e).then(function (res) {
            showOverlay(res())
          });
        };

        element.on('click', mouseup);

        function showOverlay(ev) {

          coordinates.x = ev.pageX + 'px';
          coordinates.y = ev.pageY + 'px';
          loader = angular.element(element);
          spinner = $(loader).find('.svg-loader');
          text = $(loader).find('.text').children();

          if (attrs.animateClass) {
            text.addClass('animated ' + attrs.animateClass);
          }

          spinner.attr('style',
              'display: block !important;' +
              'position: absolute;' +
              'top: ' + coordinates.y + ' !important; ' +
              'left: ' + coordinates.x + ' !important;'
          );


          mousemove = function mousemover(e) {
            coordinates.x = e.pageX + 'px';
            coordinates.y = e.pageY + 'px';
            spinner.attr('style',
                'display: block !important;' +
                'position: absolute;' +
                'top: ' + coordinates.y + ' !important; ' +
                'left: ' + coordinates.x + ' !important;'
            );
          };

          $document.on('mousemove', mousemove);

        }

        function hideOverlay() {
          spinner.attr('style', 'display: none;');
          $document.off('mousemove', mousemove);
          text.removeClass('animated ' + attrs.animateClass);
        }

      };

      var template =  '<span id="title" class="svg-loader" title="0">' +
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
        scope: {
          wcOverlayDelay: "@"
        },
        template: template +
          '<span class="text" data-ng-transclude></span>',
        link: link
      }
    }])

;



angular.module("the.directive").run(["$templateCache", function($templateCache) {$templateCache.put("directive.html","<div class=\"the-directive\"><div>The value is asdf {{getValue()}}</div><button ng-click=\"increment()\">+</button></div>");}]);