'use strict';

/* Controllers */

mainApp.controller('MainController', ['$scope', '$http', '$routeParams', 'gdisk', 'GAPI', 'Drive',
    function($scope, $http, $routeParams,gdisk, GAPI, Drive) {

        $scope.loaded = false;

        // cur folder
        var folder = {"fid":1};
        if($routeParams['folder']){
            folder.fid = $routeParams['folder'];
        }else{
            folder.fid = '1';
        }

        GAPI.init().then(function(){

            if(!$scope.tree) {
                $scope.loaded = false;
                gdisk.rootFolders().then(function(folders){

                    //$scope.$apply(function(){
                        //console.log(folders);
                        $scope.$tree = folders;
                        $scope.loaded = true;
                        //$scope.$apply();
                    //});

                });
            }



            Drive.listFiles({'maxResults':1000}).then(function(resp){

                var _folders = [];
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
                        _folders.push(item);
                    }
                }

                $scope.foldersFiles = _folders;

            })


        });

        //$scope.breadcrumbs = gdisk.breadcrumbs(folder.fid); // breadcrumbs
        //$scope.folder = folder; // сurrent folder
        //$scope.foldersFiles = gdisk.foldersFiles(folder.fid);

    }]
);

