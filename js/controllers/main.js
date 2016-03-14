'use strict';

/**
 * Main Controller.
 * Make main route
 */
mainApp.controller('MainController', ['$scope', '$rootScope', '$http', '$routeParams', '$filter',
    function($scope, $rootScope, $http, $routeParams, $filter) {

        this.name = 'MainController';

        // folder
        this.folder = {};
        if($routeParams['folder']){
            this.folder.fid = $routeParams['folder'];
        }else{
            this.folder.fid = 0;
        }
        $rootScope.folder = this.folder;

        // folders
        $rootScope.folders = [];

        // files
        $rootScope.files = [];

        $rootScope.isFolder = ($rootScope.folder.fid !== '' && $rootScope.folder.fid !== 0 && $rootScope.folder.fid != 'trash');

        $rootScope.isRoot = $rootScope.folder.fid === 0;

        $rootScope.isTrash = $rootScope.folder.fid === 'trash';

        /**
         * set breadcrumbs
         * @param bc
         */
        $scope.setBreadcrumbs = function(bc){
            $rootScope.breadcrumbs = bc;
        };

        /**
         * Set folders
         * @param fs
         */
        $scope.setFolders = function(fs){
            $rootScope.folders = fs;
        };
        // for modal windows
        $rootScope.setFolders = function(fs){
            $rootScope.folders = fs;
        };

        /**
         * Set files
         * @param fs
         */
        $scope.setFiles = function(fs){
            $rootScope.files = fs;
        };

        /**
         * Set tree navigation
         * @param tr
         */
        $rootScope.setTree = function(tr){
            if(!angular.equals($rootScope.tree, tr)){
                $rootScope.tree = tr;
            }else{
                $rootScope.rebuildTree();
            }
        };

        /**
         * Show loading animation
         */
        $rootScope.startLoadingAnimation = function(){
            $rootScope.loaded = false;
        };

        /**
         * Hide loading animation
         */
        $rootScope.stopLoadingAnimation = function(){
            $rootScope.loaded = true;
        };

        /**
         * Return current folder
         * @returns {{}|*|item.folder|Function|folder|string}
         */
        $scope.curFolder = function(){
            return $rootScope.folder;
        };

        /**
         * Rebuilding tree
         */
        $rootScope.rebuildTree = function(){
            $rootScope.tree.length++;
        };

        /**
         * Set quota total
         * @param quota
         */
        $scope.setQuotaTotal = function(quota){
            $rootScope.quotaTotal = quota;
        };

        /**
         * Set quota used
         * @param quota
         */
        $scope.setQuotaUsed = function(quota){
            $rootScope.quotaUsed = quota;
        };


    }]
);
