'use strict';

/* Controllers */

mainApp.controller('MainController', ['$scope', '$http', '$routeParams', 'gdisk', 'GAPI', 'Drive',
    function($scope, $http, $routeParams,gdisk, GAPI, Drive) {

        // cur folder
        var folder = {"fid":1};
        if($routeParams['folder']){
            folder.fid = $routeParams['folder'];
        }else{
            folder.fid = '1';
        }

        if(!$scope.tree) {
            $scope.tree = gdisk.rootFolders(); // show only root folders in first time
        }

        $scope.breadcrumbs = gdisk.breadcrumbs(folder.fid); // breadcrumbs
        $scope.folder = folder; // сurrent folder

        $scope.foldersFiles = gdisk.foldersFiles(folder.fid);

        $scope.auth=function(){
            GAPI.init();
            //$scope.list = Drive.listFiles();
        };
        //GAPI.init();


        $scope.filesList = function(){

            Drive.listFiles({'maxResults':1000}).then(function(resp){

                var folders = [];
                var data = resp.items;
                for(var i in data) {
                    var item = {};
                    if(data[i]['mimeType']=='application/vnd.google-apps.folder'){
                        item['id'] = data[i]['id'];
                        item['name'] = data[i]['title'];
                        item['owner'] = data[i]['ownerNames'].join(', ');
                        item['updateDate'] = data[i]['modifiedDate'];
                        item['collapsed'] = true;
                        item['parent'] = 1;
                        folders.push(item);
                    }
                }

                console.log(folders);
                $scope.foldersFiles = folders;

            });

        }


    }]
);

