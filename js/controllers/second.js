'use strict';

/* Controllers */

mainApp.controller('secondController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast) {

            this.name = 'secondController';

            var scope = $rootScope;

            var mObj = this;
            console.log($rootScope.folder.fid);
            $rootScope.isFolder = ($rootScope.folder.fid !== '' && $rootScope.folder.fid !== '0' && $rootScope.folder.fid != 'trash');

            $rootScope.isRoot = $rootScope.folder.fid === '0';

            $rootScope.isTrash = $rootScope.folder.fid === 'trash';

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            /**
             * open new modal window
             */
            $scope.skapa = function() {

                $mdDialog.show(
                    {
                        controller: 'secondController',
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
             * decline modal window
             */
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            /**
             * confirm creating new folder
             */
            $scope.savenewfolder = function(){

                $mdDialog.cancel(); // close modal
                $rootScope.loaded = false; // loading animations

                gdisk.createFolder($scope.newfolder, $rootScope.folder.fid).then(function(res){

                    var toast = $mdToast.simple()
                        .content('Folder '+$scope.newfolder+' created.')
                        .position('bottom right');

                    $rootScope.folders = gdisk.subFolders($rootScope.folder.fid);

                    console.log(res);

                    $rootScope.loaded = true;
                    $mdToast.show(toast);

                });

            };


        }]
);
