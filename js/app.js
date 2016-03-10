'use strict';

/* App Module */

var mainApp = angular.module('mainApp', [
    'ngRoute', 'ngMaterial', 'gapi'
]);

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


