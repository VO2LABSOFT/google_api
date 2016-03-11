'use strict';

/* Controllers */

mainApp.controller('MainController', ['$scope', '$rootScope', '$http', '$routeParams', 'gdisk', 'GAPI', 'Drive', '$mdDialog', '$mdToast',
    function($scope, $rootScope, $http, $routeParams,gdisk, GAPI, Drive, $mdDialog, $mdToast) {

        this.name = 'MainController';

        var scope = $rootScope;

        var mObj = this;

        /**
         * DEFINE FOLDER
         */
        this.folder = {"fid":1};
        if($routeParams['folder']){
            this.folder.fid = $routeParams['folder'];
        }else{
            this.folder.fid = 0;
        }
        $rootScope.folder = this.folder;

        /**
         * init default params
         */
        $rootScope.loaded = this.loaded = true; // loading animations
        $rootScope.folders = this.folders = []; // folders in current folder
        $rootScope.files = this.files = []; // files in current folder
        //scope.tree = this.tree = scope.tree ? scope.tree : []; // empty tree
        $rootScope.breadcrumbs = this.breadcrumbs = gdisk.breadcrumbs($rootScope.folder.fid); // breadcrumbs to current folder
        $rootScope.showItemMenu = true;

        /**
         * Load files from api and render
         */
        GAPI.init().then(function(){

            $rootScope.loaded = false;
            gdisk.loadFiles().then(function(){

                if(!angular.equals(scope.tree, gdisk.rootFolders())){
                    $rootScope.tree = gdisk.rootFolders();
                }

                $rootScope.folders = gdisk.subFolders(mObj.folder.fid);
                $rootScope.files = gdisk.filesInFolder(mObj.folder.fid);

                //console.log(scope.files);
                $rootScope.loaded = true;
                $rootScope.breadcrumbs = gdisk.breadcrumbs(mObj.folder.fid);

            });

        });

    }]
);
