angular.module('demo', ['ngRoute', 'jf_NavBarLoader'])

    .config(function ($routeProvider, jf_NavLoadingBarCfgProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/demo/demo.html',
                controller: 'DemoController'
            })
            .otherwise({redirectTo: '/'});

        jf_NavLoadingBarCfgProvider.setConfigs({
            delay: 1000,
            baseColor: 'white',
            baseOpacity: 0.3
        })
    })

    .controller('DemoController', function ($scope, $http) {

        $scope.posts = [];
        $scope.subreddit = null;
        $scope.subreddits = ['askscience', 'halo', 'mindcrack', 'cars', 'facepalm', 'catpictures', 'learnprogramming'];

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

        $scope.fetch();
    })
;