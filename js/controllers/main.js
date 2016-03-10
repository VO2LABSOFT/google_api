'use strict';

/* Controllers */

mainApp.controller('MainController', ['$scope', '$http', '$routeParams', 'gdisk', 'GAPI', 'Drive',
    function($scope, $http, $routeParams,gdisk, GAPI, Drive) {

        $scope.loaded = false; // loading animations

        // cur folder
        var folder = {"fid":1};
        if($routeParams['folder']){
            folder.fid = $routeParams['folder'];
        }else{
            folder.fid = 0;
        }

        $scope.foldersFiles = [];

        $scope.breadcrumbs = gdisk.breadcrumbs(folder.fid);

        console.log($scope.breadcrumbs);

        GAPI.init().then(function(){

            gdisk.loadFiles().then(function(){

                $scope.tree = gdisk.rootFolders();
                $scope.foldersFiles = gdisk.foldersFiles(folder.fid);
                $scope.loaded = true;
                $scope.breadcrumbs = gdisk.breadcrumbs(folder.fid);

            });

        });

        $scope.goto = function(e){
            //e.preventDefault();
            document.location.hash = "#/folder/"+e;
        };

        //$scope.breadcrumbs = gdisk.breadcrumbs(folder.fid); // breadcrumbs
        //$scope.folder = folder; // сurrent folder
        //$scope.foldersFiles = gdisk.foldersFiles(folder.fid);

    }]
);
