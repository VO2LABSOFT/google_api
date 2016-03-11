'use strict';

/* Controllers */

mainApp.controller('fileslistController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast) {

            this.name = 'fileslistController';

            var scope = $scope;

            var mObj = this;

            var originatorEv;

            scope.selected = gdisk.selected;

            /**
             * Navigate to folder
             * @param e
             */
            $scope.goto = function(e){
                if(e === '0') document.location.hash = "#/";
                else document.location.hash = "#/folder/"+e;
            };

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

            $scope.showLink = function(ev) {

                originatorEv = ev;

                $mdDialog.show(
                    {
                        controller: 'fileslistController',
                        templateUrl: '/js/views/dialogs/link.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                $scope.itemlink = "sdjalsjdalsjdlajdlasjda" ;

                originatorEv = null;
            };

            $scope.closeLink = function(){
                $mdDialog.cancel();
            };

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

            $scope.deleteSelected = function(){

                gdisk.deleteSelected().then(function(res){
                    var toast = $mdToast.simple()
                        .content('Deleted')
                        .position('bottom right');

                    $rootScope.loaded = true;
                    $mdToast.show(toast);
                });
            };

            $scope.showcontext = function(ev){
                originatorEv = ev;

                $mdDialog.show(
                    {
                        controller: 'fileslistController',
                        templateUrl: '/js/views/dialogs/context.html',
                        parent: angular.element(document.body),
                        targetEvent: originatorEv,
                        clickOutsideToClose:true,
                        fullscreen: false
                    }
                );

                originatorEv = null;
            }

        }]
);
