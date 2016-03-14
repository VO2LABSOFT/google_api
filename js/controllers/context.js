'use strict';

/**
 * Tree Controller.
 * Render files/folder.
 */
mainApp.controller('ContextController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', '$document',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast, $document) {

            this.name = 'TreeController';

            $scope.itemContext = function($event){

                if(angular.element($event.target).hasClass('mdl-grid')){
                    var parent = angular.element($event.target);
                    var cmenu = parent.find('md-menu-content');
                }

                if(angular.element($event.target).hasClass('mdl-cell')){
                    var parent = angular.element($event.target).parent();
                    var cmenu = parent.find('md-menu-content');
                }

                angular.element(parent.parent()).find('md-menu-content').css('display','none');
                //angular.element(window.document).find('div.mdl-grid').removeClass('selected');
                angular.element(parent.parent()).find('.mdl-grid').removeClass('selected');

                //console.log(angular.element(parent.parent()).parent().find('.mdl-grid'));

                angular.element(parent).addClass('selected');

                angular.element(cmenu).css('display','block');
                angular.element(cmenu).css('position','absolute');
                angular.element(cmenu).css('z-index','100000');
                angular.element(cmenu).css('outline','none');
                angular.element(cmenu).css( 'left', angular.element($event)[0]['layerX']+'px');
                angular.element(cmenu).css( 'top', angular.element($event)[0]['layerY']+'px');
            }

        }]
);


mainApp.controller('ContextMenuController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast) {

            this.name = 'ContextMenuController';

            $scope.$on('menuContext', function (event, data) {

                console.log($scope);

                $scope.$mdOpenMenu();
            });

            $scope.menuContextClicked = function($event){
                $scope.$mdOpenMenu($event);
                console.log($event.target);
            }

        }]
);