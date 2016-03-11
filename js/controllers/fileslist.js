'use strict';

/* Controllers */

mainApp.controller('fileslistController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast) {

            this.name = 'fileslistController';

            var scope = $rootScope;

            var mObj = this;

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
                            angular.element(event.target).parent().removeClass('selected');
                        }else{
                            angular.element(event.target).parent().addClass('selected');
                        }
                        gdisk.selectFolder(folder);
                    }
                }
                return false;
            };

            $scope.selectFile = function(file){
                if(file){
                    var parent = angular.element(event.target).parent();
                    if(parent.hasClass('mdl-grid')){
                        if(parent.hasClass('selected')){
                            angular.element(event.target).parent().removeClass('selected');
                        }else{
                            angular.element(event.target).parent().addClass('selected');
                        }
                        gdisk.selectFile(file);
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


        }]
);
