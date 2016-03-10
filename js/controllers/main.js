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

        $scope.folders = [];
        $scope.files = [];

        $scope.breadcrumbs = gdisk.breadcrumbs(folder.fid);

        GAPI.init().then(function(){

            gdisk.loadFiles().then(function(){

                var _tree = gdisk.rootFolders();
                if(!$scope.tree) $scope.tree = _tree;

                $scope.folders = gdisk.subFolders(folder.fid);
                $scope.files = gdisk.filesInFolder(folder.fid);

                $scope.loaded = true;
                $scope.breadcrumbs = gdisk.breadcrumbs(folder.fid);

            });

        });

        $scope.goto = function(e){
            //e.preventDefault();
            if(e === '0') document.location.hash = "#/";
            else document.location.hash = "#/folder/"+e;
        };

        $scope.selectFolder = function(folder){

            if(folder){
                var parent = angular.element(event.target).parent();
                if(parent.hasClass('mdl-grid')){
                    if(parent.hasClass('selected')){
                        angular.element(event.target).parent().removeClass('selected');
                    }else{
                        angular.element(event.target).parent().addClass('selected');
                    }
                    gdisk.selectFolder(folder);
                }
            }
            return false;
        };

        $scope.selectFile = function(file){
            if(file){
                var parent = angular.element(event.target).parent();
                if(parent.hasClass('mdl-grid')){
                    if(parent.hasClass('selected')){
                        angular.element(event.target).parent().removeClass('selected');
                    }else{
                        angular.element(event.target).parent().addClass('selected');
                    }
                    gdisk.selectFile(file);
                }
            }
            return false;
        };

        $scope.deleteSelected = function(){
            gdisk.deleteSelected();
        }

    }]
);
