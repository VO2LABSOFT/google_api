'use strict';

/**
 * Actions Controller for modal window.
 * Realize actions for modal windows.
 */
mainApp.controller('ActionsModalController', ['$scope', '$filter', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', 'Drive',
    function($scope, $filter, $rootScope, gdisk, $mdDialog, $mdToast, Drive) {

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
            'open':function(folder,$event){

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

                $event.stopPropagation();
                $rootScope.$broadcast('closeContext');
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

            },
            'copy':function(file){
                $scope.startLoadingAnimation();
                gdisk.file.copy(file);
            }
        };

        /**
         * Access managment
         * @type {{}}
         */
        $scope.permissions = {
            'open':function($event){
                if($rootScope.selected){

                    originatorEv = $event;
                    $mdDialog.show(
                        {
                            controller: 'ActionsModalController',
                            templateUrl: '/js/views/dialogs/rights.html',
                            parent: angular.element(document.body),
                            targetEvent: originatorEv,
                            clickOutsideToClose:true,
                            fullscreen: false
                        }
                    );

                    gdisk.permissions.load($rootScope.selected['id']);
                    originatorEv = null;
                    $rootScope._toInvite = [];

                    gdisk.permissions.list = [];
                    gdisk.permissions.invites = [];
                    gdisk.permissions.removes = [];

                }
                $rootScope.$broadcast('closeContext');
                $event.stopPropagation();
            },
            'confirm':function($event){

                if($rootScope.selected['parent']){
                    $rootScope.startLoadingAnimation();
                    $mdDialog.cancel();
                    gdisk.permissions.list = $rootScope.selected.permissions;
                    gdisk.permissions.file = $rootScope.selected['id'];
                    gdisk.permissions.update();
                }

                $event.stopPropagation();
            },
            'invite':function($chip){
                gdisk.permissions.invites.push($chip);
                return $chip;
            },
            'remove_invite':function($chip,$index){
                var c = gdisk.permissions.invites.indexOf($chip);
                delete gdisk.permissions.invites[c];
                gdisk.permissions.invites.length--;
            },
            'remove':function(permission){
                permission['deleted'] = true;
                gdisk.permissions.removes.push(permission);
            },
            'share':function(){
                gdisk.permissions.share = $rootScope.selected.is_permission_by_link;
            }
        };

        /**
         * New folder from context menu
         * @type {{open: Function, confirm: Function}}
         */
        $scope.create = {

            'folder': false,

            'open' : function(){

                $rootScope.parentForCreate = $rootScope.selected;

                $mdDialog.show(
                    {
                        controller: 'ActionsModalController',
                        templateUrl: '/js/views/dialogs/newfolder.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );
            },

            'confirm':function(){
                $mdDialog.cancel(); // close modal
                $rootScope.loaded = false;
                gdisk.folder.create($rootScope.newfoldername, $rootScope.parentForCreate.id);
            }
        };


        $scope.upload = {

            /**
             * Modal window for upload file
             */
            'open' : function(){
                $mdDialog.show(
                    {
                        controller: 'ActionsModalController',
                        templateUrl: '/js/views/dialogs/upload.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );
                $rootScope.uploaded = true;
                originatorEv = null;
            },

            'upload' : function($event){

                var f = document.getElementById('file').files[0];
                $rootScope.uploaded = false;
                gdisk.file.upload(f,$rootScope.folder.fid);

            }

        };

        /**
         * When permissions loaded
         */
        $rootScope.$on('permission_loaded', function(event, data){

            $rootScope['selected']['permissions'] = data['items'];
            gdisk.permissions.list = data['items'];

            var res = $filter('filter')(data['items'], {'type':"anyone"});
            if(res){
                $rootScope['selected']['is_permission_by_link'] = res.length>0?true:false;
                if(res.length>0){
                    $rootScope['selected']['permission_by_link'] = res[0];
                }else{
                    $rootScope['selected']['permission_by_link'] = {
                        id: "anyoneWithLink",
                        role: "reader",
                        type: "anyone"
                    };
                }
            }

            res = $filter('filter')(data['items'], {'type':"user"});
            if(res){
                $rootScope['selected']['is_permission_by_users'] = true;
                $rootScope['selected']['permission_by_users'] = res;
            }
        });

        $rootScope.$watch('is_permission_by_link',function(){
            if($rootScope.is_permission_by_link){
                console.log('access by link');
            }
        });

        $rootScope.$on('file_uploaded', function(event, data){

            $mdDialog.cancel();
            $rootScope.uploaded = true;

            var toast = $mdToast.simple()
                .content('Fil laddas upp.')
                .position('bottom right');
            $mdToast.show(toast);

        });

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
        $scope.open = function($event) {

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

            $event.stopPropagation();
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

mainApp.controller('movetreeController', ['$scope', '$rootScope', 'gdisk', '$mdDialog',
    function($scope, $rootScope, gdisk, $mdDialog) {

        $scope.curFolder = 'root';
        $scope.folders = $scope.folders = gdisk.folder.childs('root');
        $scope.folder = {'id':'root','name':'My disk', 'parent':false};
        $scope.targetFolder = '';

        angular.forEach($scope.folders,function(value,key){
            $scope.folders[key]['childs'] = gdisk.folder.childs(value['id']);
        });

        $scope.select = function(id,$event){
            var tr = angular.element($event.target);

            angular.element(tr).parent().parent().parent().find('span')
                .css('font-weight','normal').css('text-decoration','none'); // drop all selection

            angular.element(tr).css('font-weight','bold').css('text-decoration','underline'); // set selected
            $scope.targetFolder = id;
        };

        $scope.goto = function(id){
            $scope.folders = gdisk.folder.childs(id);
            $scope.folder = gdisk.folder.find(id) ? gdisk.folder.find(id) : {'id':'root','name':'My disk', 'parent':false};

        };

        $scope.move = function(){

            console.log($rootScope.selected);

            if($rootScope.selected.parent)
                gdisk.move($rootScope.selected['id'],$rootScope.selected.parent,$scope.targetFolder);
            if($rootScope.selected.folder)
                gdisk.move($rootScope.selected['id'],$rootScope.selected.folder,$scope.targetFolder);
        };

        $rootScope.$on('moved', function(){
            $mdDialog.cancel();
        });

    }]);
