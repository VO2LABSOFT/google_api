'use strict';

/**
 * Actions Controller.
 * Realize actions for files/folders, navigations.
 */
mainApp.controller('ActionsController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast) {

            this.name = 'ActionsController';

            var originatorEv;

            /**
             * Navigate to folder
             * @param e
             */
            $scope.goto = function(e){
                if(e === '0') document.location.hash = "#/";
                else document.location.hash = "#/folder/"+e;
            };

            /**
             * Select folder in list
             * @param folder
             * @returns {boolean}
             */
            $scope.selectFolder = function(folder){

                if(folder){
                    var parent = angular.element(event.target).parent();

                    if(parent.hasClass('mdl-grid')){

                        if(parent.hasClass('selected')){
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            gdisk.selectFolder();
                        }else{
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            parent.addClass('selected');
                            gdisk.selectFolder(folder);
                        }

                    }
                }

                return false;
            };

            /**
             * Select file
             * @param file
             * @returns {boolean}
             */
            $scope.selectFile = function(file){
                if(file){
                    var parent = angular.element(event.target).parent();

                    if(parent.hasClass('mdl-grid')){

                        if(parent.hasClass('selected')){
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            gdisk.selectFile();
                        }else{
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            parent.addClass('selected');
                            gdisk.selectFile(file);
                        }

                    }
                }
                return false;
            };

            /**
             * Delete selected file/folder
             */
            $scope.deleteSelected = function(){
                gdisk.deleteSelected().then(function(resp){

                    var toast = $mdToast.simple()
                        .position('bottom right');

                    if(resp.id){
                        gdisk.moveFileToTrashLocaly(resp.id);
                        gdisk.moveFolderToTrashLocaly(resp.id);
                        toast.content('Deleted');
                    }else{
                        toast.content('Error while delete');
                    }

                    $scope.setFolders(gdisk.subFolders($scope.folder.fid)); // set loaded folders
                    $scope.setFiles(gdisk.filesInFolder($scope.folder.fid)); // set loaded files

                    $rootScope.setTree(gdisk.rootFolders()); // refresh tree

                    $mdToast.show(toast);
                });
            };

            /**
             * Open menu for skapa button.
             * @param $mdOpenMenu
             * @param ev
             */
            $scope.openSkapaMenu = function($mdOpenMenu, ev){
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            /**
             * open new modal window
             * @param $event
             */
            $scope.newFolderModal = function($event) {

                $mdDialog.show(
                    {
                        controller: 'ActionsController',
                        templateUrl: '/js/views/dialogs/skapa.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                originatorEv = null;
            };

            /**
             * Cancel creating new folder
             * @param $event
             */
            $scope.cancelNewFolderModal = function($event){
                $mdDialog.cancel();
            };

            /**
             * Confirm creating new folder
             * @param $event
             */
            $scope.confirmNewFolderModal = function($event){

                $mdDialog.cancel(); // close modal

                gdisk.createFolder($scope.newfolder, $rootScope.folder.fid).then(function(resp){

                    gdisk.addFolderLocaly({'id': resp.id,
                        'parent':$rootScope.folder.fid,
                        'name':resp.title,
                        'owner': resp['ownerNames'].join(', '),
                        'size':'-',
                        'updateDate': (new Date(resp['modifiedDate'])).yyyymmdd(),
                        'collapsed':true,
                        'iconLink' : resp['iconLink']
                    });

                    var toast = $mdToast.simple()
                        .content('Folder '+$scope.newfolder+' created.')
                        .position('bottom right');

                    $rootScope.setFolders(gdisk.subFolders($rootScope.folder.fid));

                    $rootScope.setTree(gdisk.rootFolders()); // refresh tree

                    $mdToast.show(toast);

                });
            }


            $scope.hidepopups = function(){
                angular.element(window.document).find('md-menu-content').css('display','none');
                angular.element(window.document).find('.mdl-grid').removeClass('selected');
            }

        }]
);
