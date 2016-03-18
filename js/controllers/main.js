'use strict';

/**
 * Main Controller.
 * Make main route
 */
mainApp.controller('MainController', ['$scope', '$rootScope', '$http', '$routeParams', '$filter',
    function($scope, $rootScope, $http, $routeParams) {

        this.name = 'MainController';

        // folder
        this.folder = {};
        if($routeParams['folder']){
            $rootScope.folder = {'fid': $routeParams['folder']};
        }else{
            $rootScope.folder = {'fid': 'root'};
        }

        $rootScope.folders = []; // current folders

        $rootScope.files = [];

        $rootScope.isFolder = ($rootScope.folder.fid !== '' && $rootScope.folder.fid != 'trash' && $rootScope.folder.fid != 'root');

        $rootScope.isRoot = $rootScope.folder.fid === 'root';

        $rootScope.isTrash = $rootScope.folder.fid === 'trash';

        $rootScope.selectedItem = {};

        $rootScope.permissionsList = [
            "writer",
            "reader"
        ];

        /**
         * Show loading animation
         */
        $rootScope.startLoadingAnimation = function(){
            $rootScope.loaded = false;
        };

        /**
         * Hide loading animation
         */
        $rootScope.stopLoadingAnimation = function(){
            $rootScope.loaded = true;
        };

    }]
);
