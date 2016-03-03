'use strict';

/* Controllers */

mainApp.controller('MainController', ['$scope', '$routeParams', 'gdisk',
    function($scope,$routeParams,gdisk) {


        // cur folder
        var folder = 1;
        if($routeParams['folder']){
            folder = $routeParams['folder'];
        }else{
            folder = '1';
        }

        var breadcrumbs = gdisk.breadcrumbs(folder);

        $scope.breadcrumbs = breadcrumbs;



    }]
);
