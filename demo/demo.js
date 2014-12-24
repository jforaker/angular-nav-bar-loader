angular.module('demo', ['ngSanitize', 'ngRoute',  'jf.Directives'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/demo/demo.html',
                controller: 'DemoController'
            })
            .otherwise({redirectTo: '/'});
    }])

    .controller('DemoController', ['$scope', '$http', function ($scope, $http) {

        $scope.posts = [];
        $scope.section = null;
        $scope.subreddit = null;
        $scope.subreddits = ['cats', 'pics', 'funny', 'gaming', 'AdviceAnimals', 'aww'];

        var getRandomSubreddit = function () {
            var sub = $scope.subreddits[Math.floor(Math.random() * $scope.subreddits.length)];
            // ensure we get a new subreddit each time.
            if (sub == $scope.subreddit) {
                return getRandomSubreddit();
            }
            return sub;
        };

        $scope.fetch = function () {
            $scope.subreddit = getRandomSubreddit();
            $http.jsonp('http://www.reddit.com/r/' + $scope.subreddit + '.json?limit=50&jsonp=JSON_CALLBACK').success(function (data) {
                $scope.posts = data.data.children;

                console.log('data ', $scope.posts);
            })
                .error(function (data) {
                    console.log('data error', data);
                });
        };
    }])
;