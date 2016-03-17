'use strict';

/**
 * Actions Controller for modal window.
 * Realize actions for modal windows.
 */
mainApp.controller('ActionsModalController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', 'Drive',
    function($scope, $rootScope, gdisk, $mdDialog, $mdToast, Drive) {

        var originatorEv;

        /**
         * Close modal window
         */
        $scope.close = function(){
            $mdDialog.cancel();
        };

        /**
         * Show folder/file link in popup
         * @param ev
         */
        $scope.link = {
            'open': function($event){
                if($rootScope.selected){
                    originatorEv = $event;
                    $mdDialog.show(
                        {
                            controller: 'ActionsModalController',
                            templateUrl: '/js/views/dialogs/link.html',
                            parent: angular.element(document.body),
                            targetEvent: originatorEv,
                            clickOutsideToClose:true,
                            fullscreen: false
                        }
                    );
                    originatorEv = null;
                }
                $rootScope.$broadcast('closeContext');
                $event.stopPropagation();
            }
        };

        /**
         * show rename item modal
         * @param ev
         */
        $scope.rename = {
            'open':function($event){
                if($rootScope.selected){
                    originatorEv = $event;
                    $mdDialog.show(
                        {
                            controller: 'ActionsModalController',
                            templateUrl: '/js/views/dialogs/rename.html',
                            parent: angular.element(document.body),
                            targetEvent: originatorEv,
                            clickOutsideToClose:true,
                            fullscreen: false
                        }
                    );
                    originatorEv = null;
                }
                $rootScope.$broadcast('closeContext');
                $event.stopPropagation();
            },
            'confirm':function(){

                $mdDialog.cancel(); // close modal
                $rootScope.startLoadingAnimation();

                if($rootScope){
                    if($rootScope.selected['parent']){
                        gdisk.folder.rename($rootScope.selected);
                    }
                    if($rootScope.selected['folder']){
                        gdisk.file.rename($rootScope.selected);
                    }
                }
            }
        };

        /**
         * Show move modal
         */
        $scope.move = {
            'open':function(folder){

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
            },
            'confirm':function(){

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
        };

    }]);


/**
 * Controller for
 * Realize actions for modal windows.
 */
mainApp.controller('FolderModalController', ['$scope', '$rootScope', 'gdisk', '$mdDialog',
    function($scope, $rootScope, gdisk, $mdDialog) {

        var originatorEv;

        $scope.controller = 'FolderModalController';

        $scope.name = "";

        /**
         * open new modal window
         * @param $event
         */
        $scope.open = function() {

            $mdDialog.show(
                {
                    controller: $scope.controller,
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
         * Confirm creating new folder
         * @param $event
         */
        $scope.confirm = function(){
            $mdDialog.cancel(); // close modal
            $rootScope.loaded = false;
            gdisk.folder.create($scope.name, $rootScope.folder.fid);
        };

    }]);
