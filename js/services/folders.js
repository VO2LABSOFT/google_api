
'use strict';

mainApp.service('gdisk', ['Drive', '$rootScope', '$filter', function(Drive, $rootScope, $filter){

    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return (dd[1]?dd:"0"+dd[0])+'.'+(mm[1]?mm:"0"+mm[0])+'.'+yyyy; // padding
    };

    /**
     * Link to scope
     */
    var mObj = this;

    // dummy folders
    var folders = [
        /*{'id':'1','parent':'0','name':'Root','owner':'me','size':'','updateDate':'10.10.15', 'collapsed':true},*/
    ];

    // dummy files
    var files = [
        /*{'id':'1', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},*/
    ];

    // tree
    this.tree = [];

    /**
     * Folder functional
     * @type {{roots: Function, create: Function, _create: Function, select: Function, delete: Function, find: Function, childs: Function, path: Function}}
     */
    this.folder = {

        /**
         * Return roots folders
         */
        'roots' : function(){
            var roots = [];
            for(var i in folders) {
                if(folders[i]['parent'] == 'root') roots.push(folders[i]);
            }
            roots = $filter('orderBy')(roots, 'name');
            return roots;
        },

        /**
         * create new folder
         * @param $name
         * @param $parent
         */
        'create' : function(name,parent){
            parent = parent ? parent : 0;
            var f = {
                'title': name,
                'mimeType':'application/vnd.google-apps.folder'
            };
            if(parent){ f['parents'] = [ {'id' : parent} ]; }
            Drive.insertFiles(f).then(function(resp){
                resp.parents[0]['id'] = parent;
                mObj.folder._create(resp);
            });
        },

        /**
         * Create folder localy
         * @param folder
         */
        '_create' : function(folder){
            var folder = {
                'id': folder.id,
                'parent':folder.parents[0]['id'],
                'name':folder.title,
                'owner': folder['ownerNames'].join(', '),
                'size':'-',
                'updateDate': (new Date(folder['modifiedDate'])).yyyymmdd(),
                'collapsed':true,
                'iconLink' : folder['iconLink']
            };
            folders.push(folder);
            $rootScope.$broadcast('folder_created', folder);
            $rootScope.$broadcast('update_folders_files_list', folder.parent);
            $rootScope.$broadcast('update_tree');
        },

        /**
         * Set folder as selected
         * @param folder
         */
        'select':function(folder){
            if(folder['id'] && folder['parent']){
                angular.forEach(files, function(value, key){ value['selected'] = false; }); // drop selection for all
                angular.forEach(folders, function(value, key){ // drop selection for all
                    if(value['id']==folder['id']){
                        folders[key]['selected']=folders[key]['selected']?false:true;
                        $rootScope.selected = folders[key]['selected'] ? folders[key] : false;
                    }
                    else folders[key]['selected'] = false;
                });
            }else{
                console.log('Invalid folder for select.');
            }
        },

        /**
         * Delete folder
         * @param folder
         */
        'delete' : function(folder){
            if(folder['id'] && folder['parent']){

                Drive.trashFile(folder['id']).then(function(){
                    angular.forEach(folders, function(value, key){
                        if(value['id']==folder['id']){
                            delete folders[key];
                            $rootScope.$broadcast('item_deleted', folder);
                            $rootScope.$broadcast('update_folders_files_list', folder.parent);
                            return true;
                        }
                    });
                });

            }else{
                console.log('Invalid folder for select.');
            }
        },

        /**
         * Find folder by id
         * @param folderId
         * @returns {*}
         */
        'find' : function(folderId){
            var res = $filter('filter')(folders, {'id':folderId});
            if(res && res.length > 0) return res[0];
            else return false;
        },

        /**
         * Return subfolders
         * @param parentId
         * @returns {*}
         */
        'childs' : function(parentId){
            var res = $filter('filter')(folders, {'parent':parentId});
            if(res && res.length > 0) return res;
            else return false;
        },

        /**
         * Breadcrumbs for given folder
         * @param folder
         * @returns {*}
         */
        'path':function(folderId) {

            folderId = folderId || root;

            if(folderId == 'root'){
                return [{'id':'0','parent':'root','name':'Min enhet','owner':'me','size':'','updateDate':'', 'collapsed':true}]
            }else{
                var folder = mObj.folder.find(folderId);
                var _b = [];
                _b.push(folder);
                if(folder.parent != 'root'){
                    while(folder.parent != "root") {
                        folder = mObj.folder.find(folder.parent);
                        if(folder) _b.push(folder);
                        else return _b;
                    }
                }
                _b.push({'id':'0','parent':'root','name':'Min enhet','owner':'me','size':'','updateDate':'', 'collapsed':true});
                return _b.reverse();
            }
        },

        /**
         * Rename folder
         * @param folder
         */
        'rename':function(folder){
            Drive.updateFiles(folder.id, {title:folder.name}).then(function(res){
                var folder = mObj.folder.find(res.id);
                folder['name'] = res['title'];
                $rootScope.$broadcast('update_folders_files_list', folder.parent);
            });
        },

        /**
         * Expand folder in tree
         * @param folderId
         * @returns {boolean}
         */
        'expand':function(folderId){
            folderId = folderId || false;
            if(folderId) {
                for(var _f in folders) {
                    if(folders[_f]['id'] == folderId){
                        folders[_f]['collapsed'] = false;
                    }
                }
                return false;
            }
            return false;
        },

        /**
         * Collapse folder in tree
         * @param folderId
         * @returns {boolean}
         */
        'collapse':function(folderId){
            folderId = folderId || false;

            if(folderId) {
                for(var _f in folders) {
                    if(folders[_f]['id'] == folderId){
                        folders[_f]['collapsed'] = false;
                    }
                }
                return false;
            }
            return false;
        },

        /**
         * Load permissions for folder
         * @param folderId
         */
        'getpermissions':function(folderId){
            Drive.listPermissions(folderId).then(function(resp){ $rootScope.$broadcast('permission_loaded', resp); });
        },

        'setpermissions':function(folderId, permisssions){

            angular.forEach(permisssions, function(value,key){

                var len = permisssions.length;

                Drive.patchPermissions(folderId, value['id'], value).then(function(res){
                    if(key+1 == len){
                        $rootScope.$broadcast('permission_updated');
                    }
                });

            });

        }

    };

    /**
     * File functional
     * @type {{find: Function, childs: Function, select: Function, delete: Function}}
     */
    this.file = {

        'find':function(fileId){
            var res = $filter('filter')(files, {'id':fileId});
            if(res && res.length > 0) return res[0];
            else return false;
        },

        /**
         * Return files in folder
         * @param parentId
         * @returns {*}
         */
        'childs' : function(parentId){
            var res = $filter('filter')(files, {'folder':parentId});
            if(res && res.length > 0) return res;
            else return false;
        },

        /**
         * Select file in list
         * @param file
         */
        'select':function(file){
            if(file['id'] && file['folder']){
                angular.forEach(folders, function(value, key){ folders[key]['selected'] = false; }); // drop selection for all
                angular.forEach(files, function(value, key){ // drop selection for all
                    if(value['id']==file['id']){
                        files[key]['selected']=files[key]['selected']?false:true;
                        $rootScope.selected = files[key]['selected']?files[key]:false;
                    }
                    else files[key]['selected'] = false;
                });
            }else{
                console.log('Invalid file for select.');
            }
        },

        /**
         * Delete file
         * @param file
         */
        'delete' : function(file){
            if(file['id'] && file['folder']){

                Drive.trashFile(file['id']).then(function(){
                    angular.forEach(file, function(value, key){
                        if(value['id']==file['id']){
                            delete files[key];
                            $rootScope.$broadcast('item_deleted', folder);
                            $rootScope.$broadcast('update_folders_files_list', folder.parent);
                            return true;
                        }
                    });
                });

            }else{
                console.log('Invalid file for select.');
            }
        },

        /**
         * Rename file
         * @param folder
         */
        'rename':function(file){
            Drive.updateFiles(file.id, {title:file.name}).then(function(res){
                var file = mObj.file.find(res.id);
                file['name'] = res['title'];
                $rootScope.$broadcast('update_folders_files_list', file.folder);
            });
        }

    };

    /**
     * Account info
     * @type {{load: Function, data: {}}}
     */
    this.accountinfo = {
        /**
         * Load quota info
         */
        'load':function(){
            Drive.about().then(function(e){

                var quotaBytesTotal = parseInt(e.quotaBytesTotal);
                var quotaBytesUsed = parseInt(e.quotaBytesUsed);

                // display in Mb
                if(quotaBytesTotal >1000000 && quotaBytesTotal < 1000000000){
                    quotaBytesTotal = quotaBytesTotal/1000000;
                    quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Mb';
                }

                // display in Gb
                if(quotaBytesTotal >1000000000 && quotaBytesTotal < 1000000000000){
                    quotaBytesTotal = quotaBytesTotal/1000000000;
                    quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Gb';
                }

                // display in Tb
                if(quotaBytesTotal >1000000000000 && quotaBytesTotal < 1000000000000000){
                    quotaBytesTotal = quotaBytesTotal/1000000000000;
                    quotaBytesTotal = quotaBytesTotal.toFixed(2)+' Tb';
                }

                // display in Mb
                if(quotaBytesUsed >1000000 && quotaBytesUsed < 1000000000){
                    quotaBytesUsed = quotaBytesUsed/1000000;
                    quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Mb';
                }

                // display in Gb
                if(quotaBytesUsed >1000000000 && quotaBytesUsed < 1000000000000){
                    quotaBytesUsed = quotaBytesUsed/1000000000;
                    quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Gb';
                }

                // display in Tb
                if(quotaBytesUsed >1000000000000 && quotaBytesUsed < 1000000000000000){
                    quotaBytesUsed = quotaBytesUsed/1000000000000;
                    quotaBytesUsed = quotaBytesUsed.toFixed(2)+' Tb';
                }

                mObj.accountinfo.data['total'] = quotaBytesTotal;
                mObj.accountinfo.data['used'] = quotaBytesUsed;

                $rootScope.$broadcast('account_info_loaded');

            });
        },

        /**
         * Quota info
         */
        'data':{}
    };

    /**
     * Return selected Folder/File
     */
    this.selected = function(){
        var res = false;
        angular.forEach(folders, function(value,key){
            if(value['selected']) res = folders[key];
        });
        angular.forEach(files, function(value,key){
            if(value['selected']) res = files[key];
        });
        return res;
    };

    /**
     * Load files list from api
     * @returns {*}
     */
    this.load = function(){
        Drive.listFiles({'maxResults':2000}).then(function(resp){
            var data = resp.items;
            for(var i in data) {
                var item = {};

                var fileSize = data[i]['fileSize'];

                if(data[i]['fileSize']){

                    if(fileSize > 1 && fileSize < 1000){ fileSize += 'B'; }
                    if(fileSize > 1000 && fileSize < 1000000){ fileSize=fileSize/1000; fileSize = parseFloat(fileSize).toFixed(2); fileSize += 'Kb'; }
                    if(fileSize > 1000000){fileSize=fileSize/1000000; fileSize = parseFloat(fileSize).toFixed(2); fileSize += 'Mb'; }

                }else{
                    fileSize = '-';
                }

                if(data[i]['mimeType']=='application/vnd.google-apps.folder'){
                    if(data[i]['parents'][0]){
                        item['id'] = data[i]['id'];
                        item['name'] = data[i]['title'];
                        item['owner'] = data[i]['ownerNames'].join(', ');
                        item['updateDate'] = (new Date(data[i]['modifiedDate'])).yyyymmdd();
                        item['_updateDate'] = (new Date(data[i]['modifiedDate'])).getTime();
                        item['collapsed'] = true;
                        item['parent'] = data[i]['parents'][0]['isRoot'] ? 'root' : data[i]['parents'][0]['id'] ;
                        item['iconLink'] = data[i]['iconLink'];
                        item['selected'] = false;
                        item['size'] = fileSize;
                        item['link'] = data[i]['alternateLink'];
                        item['version'] = data[i]['version'];
                    }
                    if(data[i]['explicitlyTrashed']) item.parent = 'trash';
                    if(!mObj.folder.find(item['id'])) folders.push(item);
                }else{
                    if(data[i]['parents'][0] && data[i]['id']){
                        item['id'] = data[i]['id'];
                        item['name'] = data[i]['title'];
                        item['owner'] = data[i]['ownerNames'].join(', ');
                        item['updateDate'] = (new Date(data[i]['modifiedDate'])).yyyymmdd();
                        item['_updateDate'] = (new Date(data[i]['modifiedDate'])).getTime();
                        item['collapsed'] = true;
                        item['folder'] = data[i]['parents'][0]['isRoot'] ? 'root' : data[i]['parents'][0]['id'] ;
                        item['isfile'] = true;
                        item['size'] = fileSize;
                        item['iconLink'] = data[i]['iconLink'];
                        item['selected'] = false;
                        item['link'] = data[i]['alternateLink'];
                        item['version'] = data[i]['version'];

                        if(data[i]['webContentLink']){
                            item['downloadlink'] = data[i].webContentLink;
                        }
                        if(data[i]['exportLinks']){
                            angular.forEach(data[i].exportLinks, function(l,key){ item['downloadlink'] = l; });
                        }

                    }
                    if(data[i]['explicitlyTrashed']) item.folder = 'trash';
                    if(!mObj.file.find(item['id']))files.push(item);
                }
            }
            $rootScope.$broadcast('api_loaded');
        });
    };



    /// DEPRICATED!


    this.moveFile = function(id, oldparent, newparent){


        Drive.insertParents(id,newparent).then(function(){
            Drive.deleteParents(id, oldparent);
        });

        //console.log(id,oldparent);
        //return Drive.updateFiles(id, {removeParents: oldparent});
    };



}]);