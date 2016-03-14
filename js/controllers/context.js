'use strict';

/**
 * Tree Controller.
 * Render files/folder.
 */
mainApp.controller('ContextController', ['$scope', '$rootScope', 'gdisk', '$mdDialog', '$mdToast', '$document',
        function($scope, $rootScope, gdisk, $mdDialog, $mdToast, $document) {

            this.name = 'TreeController';

            $scope.itemContext = function($event, item){

                var parent = $($event.target).closest('.mdl-grid');
                var cmenu = $(parent).find('md-menu-content');

                // hide previous open context
                $(parent).closest('.tablerow').find('md-menu-content').css('display','none');

                if(!item.folder && item.folder !== 0){
                    if( !$scope.selectFolder(item) ) return;
                }else{
                    if( !$scope.selectFile(item) ) return;
                }

                $(cmenu).css('display','block');
                $(cmenu).css('position','absolute');
                $(cmenu).css('z-index','100000');
                $(cmenu).css('outline','none');

                var top = $($event)[0]['layerY'] + $(parent).parent().scrollTop();

                if( top+$(cmenu).height()+200 >= $(parent).parent()[0].scrollHeight ){
                    top=top-$(cmenu).height();
                }

                $(cmenu).css( 'left', angular.element($event)[0]['layerX']+'px');
                $(cmenu).css( 'top', top);
            };

            $scope.showLinkContext = function(item){
                $scope.showLink();
            };

            $scope.deleteFolderContext = function(folder){
                $scope.deleteSelected();
            };

            $scope.downloadFolderContext = function(folder){
                $scope.downloadSelected();
            }

        }]
);
