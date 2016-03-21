'use strict';

/**
 * Actions Controller.
 * Realize actions for files/folders, navigations.
 */
mainApp.controller('ActionsController', ['GoogleApp', 'GAPI', '$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', 'Drive',
        function(GoogleApp, GAPI, $scope, $rootScope, gdisk, $mdDialog, $mdToast, Drive) {

            this.name = 'ActionsController';

            /**
             * Navigate to folder
             * @param e
             */
            $scope.goto = function(e){
                if(e === '0') document.location.hash = "#/";
                else document.location.hash = "#/folder/"+e;
            };

            /**
             * Download selected
             */
            $scope.download = function($event){
                $rootScope.$broadcast('closeContext');
                $event.stopPropagation();
                if($rootScope.selected && $rootScope.selected['downloadlink']){
                    window.location = $rootScope.selected['downloadlink'];
                }
            };

            /**
             * Delete selected folder/file
             */
            $scope.delete = function($event){
                if($rootScope.selected){
                    $scope.startLoadingAnimation();
                    if($rootScope.selected['parent']) gdisk.folder.delete($rootScope.selected);
                    if($rootScope.selected['folder']) gdisk.file.delete($rootScope.selected);
                }
                $rootScope.$broadcast('closeContext');
                $event.stopPropagation();
            };

            /**
             * Select folder/file
             * @param item
             */
            $scope.select = function($event, item){
                if(item['parent']) gdisk.folder.select(item);
                if(item['folder']) gdisk.file.select(item);
                $rootScope.$broadcast('update_folders_files_list', item['parent'] ? item['parent'] : item['folder']);
                $rootScope.$broadcast('closeContext');
            };

            $scope.logout = function(){
                gapi.auth.signOut();
                window.location = "/#/login";
            };

            $scope.auth = function($event){

                $event.preventDefault();
                var onAuth = function (response) {
                    if(response.error) window.location = '/#/login';
                    else{
                        window.location = '/#/';
                    }
                };
                gapi.load('auth2', function() {
                    gapi.auth.authorize({
                            client_id: GoogleApp.clientId,
                            scope: GoogleApp.scopes,
                            "immediate": false
                        }, onAuth
                    );
                });
                return false;
            };

        }]);
