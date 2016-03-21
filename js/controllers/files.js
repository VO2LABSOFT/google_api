'use strict';

/**
 * Files Controller.
 * Render files/folder.
 */
mainApp.controller('FilesController', ['$scope', '$rootScope', 'gdisk', 'GAPI', '$mdDialog', '$mdToast',
        function($scope,$rootScope, gdisk, GAPI, $mdDialog, $mdToast) {

            this.name = 'FilesController';

            /**
             * On new folder created
             */
            $rootScope.$on('folder_created', function(event, data){
                var toast = $mdToast.simple()
                    .content('Folder '+data.name+' created.')
                    .position('bottom right');

                $mdToast.show(toast);
                $scope.stopLoadingAnimation();
            });

            $rootScope.$on('file_copied', function(event, data){
                var toast = $mdToast.simple()
                    .content('File '+data.name+' copied.')
                    .position('bottom right');

                $mdToast.show(toast);
                $scope.stopLoadingAnimation();
            });

            /**
             * On folder deleted
             */
            $rootScope.$on('item_deleted', function(event, data){
                var toast = $mdToast.simple()
                    .content(data.name+' deleted.')
                    .position('bottom right');
                $mdToast.show(toast);
                $scope.stopLoadingAnimation();
            });

            /**
             * Refresh list
             */
            $rootScope.$on('update_folders_files_list', function(event, folderId){
                $rootScope.folders = gdisk.folder.childs($rootScope.folder.fid); // set loaded folders
                $rootScope.files = gdisk.file.childs($rootScope.folder.fid); // set loaded files
                // tree
                var tr = gdisk.folder.roots();
                if(!angular.equals($rootScope.tree, tr)){
                    $rootScope.tree = tr;
                }else{
                    $rootScope.tree.length++;
                }
                $scope.stopLoadingAnimation();
            });

            /**
             * permission updated
             */
            $rootScope.$on('permission_updated', function(){
                var toast = $mdToast.simple()
                    .content('Permission updated.')
                    .position('bottom right');

                $mdToast.show(toast);
                $scope.stopLoadingAnimation();
            });

            /**
             * When api loaded
             */
            $rootScope.$on('api_loaded', function(){

                $rootScope.folders = gdisk.folder.childs($scope.folder.fid)
                $rootScope.files = gdisk.file.childs($scope.folder.fid);
                $rootScope.breadcrumbs = gdisk.folder.path($scope.folder.fid);

                // tree
                var tr = gdisk.folder.roots();
                if(!angular.equals($rootScope.tree, tr)){
                    $rootScope.tree = tr;
                }else{
                    $rootScope.tree.length++;
                }

                $rootScope.stopLoadingAnimation();
            });

            /**
             * When account info loaded
             */
            $rootScope.$on('account_info_loaded', function(event, data){
                $rootScope.quotaTotal = gdisk.accountinfo.data['total'];
                $rootScope.quotaUsed = gdisk.accountinfo.data['used'];
            });

            if($scope.folder.fid == 'trash') $scope.order = '-_updateDate';
            else $scope.order = 'name';

            /**
             * Load files from api and render
             */
            GAPI.init().then(function(){
                $scope.startLoadingAnimation();
                gdisk.load();
                gdisk.accountinfo.load();
            });

            $scope.sortName = function(){

                if($scope.order.indexOf("-") > -1){
                    $scope.order = "name";
                }else{
                    $scope.order = "-name";
                }

            };
            $scope.sortUpdated = function(){
                if($scope.order.indexOf("-") > -1){
                    $scope.order = "_updateDate";
                }else{
                    $scope.order = "-_updateDate";
                }
            };

        }]
);

