'use strict';

/**
 * Actions Controller.
 * Realize actions for files/folders, navigations.
 */
mainApp.controller('ActionsController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', 'Drive',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast, Drive) {

            this.name = 'ActionsController';

            var originatorEv;

            /**
             * set folder to move to
             * @param folder
             */
            $scope.setFolderToMove = function(folder){
                $rootScope.folderToMoveTo = folder;
                console.log($rootScope.folderToMoveTo);
            };

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

                        $(parent.parent()).find('.mdl-grid').removeClass('selected');

                        if(parent.hasClass('selected')){
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            gdisk.selectFolder();
                        }else{
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            parent.addClass('selected');
                            gdisk.selectFolder(folder);
                        }
                        return true;

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

                        $(parent.parent()).find('.mdl-grid').removeClass('selected');

                        if(parent.hasClass('selected')){
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            gdisk.selectFile();
                        }else{
                            angular.element(parent.parent().children()).removeClass('selected'); // remove all selections
                            parent.addClass('selected');
                            gdisk.selectFile(file);
                        }
                        return true;
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
             * Download selected
             */
            $scope.downloadSelected = function(){
                gdisk.downloadSelected().then(function(resp){

                    console.log(resp);
                    if(resp.webContentLink){
                        window.open(resp.webContentLink);
                    }
                    if(resp.exportLinks){
                        var link = '';
                        angular.forEach(resp.exportLinks, function(l,key){
                            link = l;
                        });
                        window.open(link);
                    }

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
            };

            $scope.hidepopups = function(){
                angular.element(window.document).find('md-menu-content').css('display','none');
                angular.element(window.document).find('.mdl-grid').removeClass('selected');
            };

            /**
             * Show folder/file link in popup
             * @param ev
             */
            $scope.showLink = function(ev){

                originatorEv = ev;
                var selected = gdisk.getSelected();
                $rootScope.selected = {};
                $rootScope.selected['link'] = selected[0]['link'];

                $mdDialog.show(
                    {
                        controller: 'ActionsController',
                        templateUrl: '/js/views/dialogs/link.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                originatorEv = null;
            };

            $scope.closeLinkModal = function(){
                $mdDialog.cancel();
            }

            /**
             * show rename item modal
             * @param ev
             */
            $scope.renameFolder = function(ev){
                originatorEv = ev;
                var selected = gdisk.getSelected();

                $rootScope.selectedItem = selected[0];

                $mdDialog.show(
                    {
                        controller: 'ActionsController',
                        templateUrl: '/js/views/dialogs/rename.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                originatorEv = null;
            };

            /**
             * Confirm rename
             */
            $scope.confirmRenameModal = function(){

                $mdDialog.cancel(); // close modal

                gdisk.updateFile($rootScope.selectedItem).then(function(resp){
                    //gdisk.updateFileLocaly(resp);

                    if(resp.mimeType == "application/vnd.google-apps.folder"){
                        gdisk.updateFolderLocaly({'id': resp.id,
                            'parent':resp.parents[0]['id'],
                            'name':resp.title,
                            'owner': resp['ownerNames'].join(', '),
                            'size':'-',
                            'updateDate': (new Date(resp['modifiedDate'])).yyyymmdd(),
                            'collapsed':true,
                            'iconLink' : resp['iconLink']
                        });
                    }else{
                        gdisk.updateFolderLocaly({'id': resp.id,
                            'folder':resp.parents[0]['id'],
                            'name':resp.title,
                            'owner': resp['ownerNames'].join(', '),
                            'size':'-',
                            'updateDate': (new Date(resp['modifiedDate'])).yyyymmdd(),
                            'collapsed':true,
                            'iconLink' : resp['iconLink']
                        });
                    }

                });
            };

            /**
             * Show move modal
             */
            $scope.moveModal = function(folder){

                $rootScope.folderToMoveTo = false;
                $rootScope.folderToMove = folder;

                $rootScope.oldParent = (folder.parent || folder.parent == 0) ? folder.parent : folder.folder;

                $mdDialog.show(
                    {
                        controller: 'ActionsController',
                        templateUrl: '/js/views/dialogs/move.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                originatorEv = null;
            };

            /**
             * Confirm move
             */
            $scope.confirmMove = function(){

                $mdDialog.cancel(); // close modal

                Drive.insertParents($rootScope.folderToMove.id,{'id':$rootScope.folderToMoveTo});


                //gdisk.moveFile($rootScope.folderToMove.id, $rootScope.oldParent, $rootScope.folderToMoveTo).then(function(resp){

                    //console.log(resp);

                    //console.log($rootScope.folderToMove, $rootScope.folderToMoveTo);

                    /*if(resp.mimeType == "application/vnd.google-apps.folder"){
                        gdisk.updateFolderLocaly({'id': resp.id,
                            'parent':resp.parents[0]['id'],
                            'name':resp.title,
                            'owner': resp['ownerNames'].join(', '),
                            'size':'-',
                            'updateDate': (new Date(resp['modifiedDate'])).yyyymmdd(),
                            'collapsed':true,
                            'iconLink' : resp['iconLink']
                        });
                    }else{
                        gdisk.updateFolderLocaly({'id': resp.id,
                            'folder':resp.parents[0]['id'],
                            'name':resp.title,
                            'owner': resp['ownerNames'].join(', '),
                            'size':'-',
                            'updateDate': (new Date(resp['modifiedDate'])).yyyymmdd(),
                            'collapsed':true,
                            'iconLink' : resp['iconLink']
                        });
                    }*/

                //});

            }

        }]
);
