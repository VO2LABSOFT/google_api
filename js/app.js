'use strict';

/* App Module */

var mainApp = angular.module('mainApp', [
    'ngRoute', 'ngMaterial', 'gapi'
]);

mainApp.value('GoogleApp', {
    apiKey: 'AIzaSyBuh_FVhtqwknTIqyDqg39hYP0t6bS00WM',
    clientId: '968862786848-8rjcjbtpclrovtr3raouekj0ieupng32.apps.googleusercontent.com', //qePG9094Y9Rq5j6Tqsw0G1St
    scopes: [
        'https://www.googleapis.com/auth/drive'
    ]
});

mainApp.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.
            when('/', {
                templateUrl: 'js/views/main.html',
                controller: 'MainController'
            });

        $routeProvider.
            when('/folder/:folder', {
                templateUrl: 'js/views/main.html',
                controller: 'MainController',
                controllerAs: "mainApp"
            });

    }]);


