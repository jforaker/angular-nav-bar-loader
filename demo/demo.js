angular.module('demo', ['ngRoute', 'jf.Directives'])

    .config(function ($routeProvider, jfSpinnerConfigProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/demo/demo.html',
                controller: 'DemoController'
            })
            .otherwise({redirectTo: '/'});

        jfSpinnerConfigProvider.setDelay(500);
        jfSpinnerConfigProvider.setBaseAnimationClass('flash');
    })

    .controller('DemoController', function ($scope, $http) {

        $scope.posts = [];
        $scope.subreddit = null;
        $scope.subreddits = ['cats', 'pics', 'funny', 'gaming', 'AdviceAnimals', 'aww'];

        var getRandomSubreddit = function () {
            var sub = $scope.subreddits[Math.floor(Math.random() * $scope.subreddits.length)];
            if (sub == $scope.subreddit) {
                return getRandomSubreddit();
            }
            return sub;
        };

        $scope.fetch = function () {
            $scope.subreddit = getRandomSubreddit();
            var req = 'http://www.reddit.com/r/' + $scope.subreddit + '.json?limit=50&jsonp=JSON_CALLBACK';
            $http.jsonp(req)
                .success(function (data) {
                    $scope.posts = data.data.children;
                })
                .error(function (data) {
                    console.log('data error', data);
                });
        };
    })
;