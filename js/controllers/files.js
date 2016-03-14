'use strict';

/**
 * Files Controller.
 * Render files/folder.
 */
mainApp.controller('FilesController', ['$scope', '$rootScope', 'gdisk', 'GAPI', '$mdDialog', '$mdToast',
        function($scope,$rootScope, gdisk, GAPI, $mdDialog, $mdToast) {

            this.name = 'FilesController';

            //if(gdisk.tree) $scope.setTree(gdisk.tree); // init tree

            /**
             * init default params
             */
            $scope.startLoadingAnimation(); // loading animations

            if($scope.folder.fid == 'trash') $scope.order = '-_updateDate';
            else $scope.order = 'name';

            /**
             * Load files from api and render
             */
            GAPI.init().then(function(){

                gdisk.loadFiles().then(function(){

                    $scope.setFolders(gdisk.subFolders($scope.folder.fid)); // set loaded folders
                    $scope.setFiles(gdisk.filesInFolder($scope.folder.fid)); // set loaded files
                    $scope.setBreadcrumbs(gdisk.breadcrumbs($scope.folder.fid)); // set breadcrumbs
                    gdisk.tree = gdisk.rootFolders();
                    $scope.setTree(gdisk.tree);
                    $scope.stopLoadingAnimation(); // stop loading animation

                });

                gdisk.loadInfo().then(function(e){

                    var quotaBytesTotal = parseInt(e.quotaBytesTotal);
                    var quotaBytesUsed = parseInt(e.quotaBytesUsed);

                    // display in Mb
                    if(quotaBytesTotal >1000000 && quotaBytesTotal < 1000000000){
                        quotaBytesTotal = quotaBytesTotal/1000000;
                        quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Mb';
                    }

                    // display in Gb
                    if(quotaBytesTotal >1000000000 && quotaBytesTotal < 1000000000000){
                        quotaBytesTotal = quotaBytesTotal/1000000000;
                        quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Gb';
                    }

                    // display in Tb
                    if(quotaBytesTotal >1000000000000 && quotaBytesTotal < 1000000000000000){
                        quotaBytesTotal = quotaBytesTotal/1000000000000;
                        quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Tb';
                    }

                    // display in Mb
                    if(quotaBytesUsed >1000000 && quotaBytesUsed < 1000000000){
                        quotaBytesUsed = quotaBytesUsed/1000000;
                        quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Mb';
                    }

                    // display in Gb
                    if(quotaBytesUsed >1000000000 && quotaBytesUsed < 1000000000000){
                        quotaBytesUsed = quotaBytesUsed/1000000000;
                        quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Gb';
                    }

                    // display in Tb
                    if(quotaBytesUsed >1000000000000 && quotaBytesUsed < 1000000000000000){
                        quotaBytesUsed = quotaBytesUsed/1000000000000;
                        quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Tb';
                    }

                    $scope.setQuotaTotal(quotaBytesTotal);
                    $scope.setQuotaUsed(quotaBytesUsed);
                });

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

