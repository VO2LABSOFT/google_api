
'use strict';

mainApp.service('gdisk', ['Drive', function(Drive){

    /**
     * Link to scope
     */
    var mObj = this;

    // dummy folders
    var folders = [
        {'id':'1','parent':'0','name':'Root','owner':'me','size':'','updateDate':'10.10.15', 'collapsed':true},
        {'id':'2','parent':'1','name':'sub root','owner':'me','size':'','updateDate':'10.10.15', 'collapsed':true },
        {'id':'3','parent':'1','name':'sub root2','owner':'me','size':'','updateDate':'10.10.15', 'collapsed':true },
        {'id':'4','parent':'0','name':'Root 2', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'5','parent':'4','name':'2 sub root','owner':'me','size':'','updateDate':'10.10.15', 'collapsed':true},
        {'id':'6','parent':'4','name':'2 sub root2', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'7','parent':'4','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'8','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'9','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'10','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'11','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'12','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'13','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'14','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'15','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'16','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'17','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'18','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'19','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'20','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'21','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'22','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'23','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'24','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'25','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'26','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true},
        {'id':'27','parent':'7','name':'Else One!!!', 'owner': 'me', 'size': '', 'updateDate': '10.10.15', 'collapsed':true}
    ];

    // selected folders on page
    var selectedFolders = [];

    // selected files on page
    var selectedFiles = [];

    // dummy files
    var files = [
        {'id':'1', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'2', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'3', 'folder':'2', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'4', 'folder':'3', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true}
    ];

    /**
     * Return root folders
     * @returns {Array}
     */
    this.rootFolders = function(){

        var roots = [];
        for(var i in folders) {
            if(folders[i]['parent'] == 0) roots.push(folders[i]);
        }
        return roots;

    };

    /**
     * Load files list from api
     * @returns {*}
     */
    this.loadFiles = function(){
        return Drive.listFiles({'maxResults':2000}).then(function(resp){

            var _folders = [];
            var _files = [];
            var data = resp.items;
            for(var i in data) {
                var item = {};

                if(!data[i]['explicitlyTrashed']){
                    if(data[i]['mimeType']=='application/vnd.google-apps.folder'){
                        if(data[i]['parents'][0]){
                            item['id'] = data[i]['id'];
                            item['name'] = data[i]['title'];
                            item['owner'] = data[i]['ownerNames'].join(', ');
                            item['updateDate'] = data[i]['modifiedDate'];
                            item['collapsed'] = true;
                            item['parent'] = data[i]['parents'][0]['isRoot'] ? 0 : data[i]['parents'][0]['id'] ;
                            item['iconLink'] = data[i]['iconLink'];
                            item['selected'] = false;
                        }
                        _folders.push(item);
                    }else{
                        if(data[i]['parents'][0]){
                            item['id'] = data[i]['id'];
                            item['name'] = data[i]['title'];
                            item['owner'] = data[i]['ownerNames'].join(', ');
                            item['updateDate'] = data[i]['modifiedDate'];
                            item['collapsed'] = true;
                            item['folder'] = data[i]['parents'][0]['isRoot'] ? 0 : data[i]['parents'][0]['id'] ;
                            item['isfile'] = true;
                            item['size'] = data[i]['fileSize'];
                            item['iconLink'] = data[i]['iconLink'];
                            item['selected'] = false;
                        }
                        _files.push(item);
                    }
                }

            }
            folders = _folders;
            files = _files;
        });
    };

    this.files = function(folder) {
        return files;
    };

    /**
     * Return breadcrumbs for folder
     * @param folder
     * @returns {Array}
     */
    this.breadcrumbs = function(folder) {

        folder = folder || false;
        if(folder) folder = mObj.folder(folder);
        else return [];

        var _b = [];
        _b.push(folder);

        if(folder.parent != 0){
            while(folder.parent != 0) {
                folder = mObj.folder(folder.parent);
                if(folder) _b.push(folder);
                else return _b;
            }
        }

        _b.push({'id':'0','parent':'0','name':'Disk','owner':'me','size':'','updateDate':'', 'collapsed':true});

        return _b.reverse();
    };

    /**
     * Return folder by folder id
     * @param folderId
     * @returns {*}
     */
    this.folder = function(folderId) {

        folderId = folderId || false;

        if(folderId) {
            for(var _f in folders) {
                if(folders[_f]['id'] == folderId){
                    return folders[_f];
                }
            }
            return false;
        }
        return false;
    };

    /**
     * Return sub folders by parent
     * @param parent
     * @returns {*}
     */
    this.subFolders = function(parent) {
        parent = parent || false;

        if(parent) {
            var subFolders = [];
            for(var _f in folders) {
                if(folders[_f]['parent'] == parent) {
                    subFolders.push(folders[_f]);
                }
            }
            return subFolders.length > 0 ? subFolders : false;
        }else{
            return mObj.rootFolders();
        }
    };

    /**
     * Return files in directory
     * @param folder
     * @returns {*}
     */
    this.filesInFolder = function(folder) {
        folder = folder || false;
        var _files = [];
        if(folder) {
            for(var _f in files) {
                if(files[_f]['folder'] == folder) {
                    _files.push(files[_f]);
                }
            }
            return _files.length > 0 ? _files : false;
        }else{
            for(var _f in files) {
                if(files[_f]['folder'] == 0) {
                    _files.push(files[_f]);
                }
            }
            return _files.length > 0 ? _files : false;
        }
    };

    /**
     * Return subfolders and files in folder
     * @param folder
     * @returns {Array}
     */
    this.foldersFiles = function(folder) {
        folder = folder || '0';
        var items = [];
        var _subFolders = mObj.subFolders(folder);
        var _files = mObj.filesInFolder(folder);

        for(var i in _subFolders){
            items.push(_subFolders[i]);
        }
        for(var i in _files){
            items.push(_files[i]);
        }
        return items;
    };

    /**
     * select|deselect folder
     * @param folder
     */
    this.selectFolder = function(folder) {
        if(selectedFolders.indexOf(folder) == -1){
            selectedFolders.push(folder);
        } else {
            delete(selectedFolders[selectedFolders.indexOf(folder)]);
            selectedFolders.length--;
        }
    };

    /**
     * select|deselect file
     * @param file
     */
    this.selectFile = function(file) {
        if(selectedFiles.indexOf(file) == -1){
            selectedFiles.push(file);
        } else {
            delete(selectedFiles[selectedFiles.indexOf(file)]);
            selectedFiles.length--;
        }
    };

    /**
     * Remove all selected files|folders
     */
    this.deleteSelected = function() {

        if(selectedFiles.length > 0){
            angular.forEach(selectedFiles, function(file, key) {
                mObj.deleteFile(file);
            });
        }

        if(selectedFolders.length > 0){
            angular.forEach(selectedFolders, function(folder, key) {
                mObj.deleteFolder(folder);
            });
        }
    };

    this.deleteFile = function(file){
        Drive.deleteFiles(file.id).then(function(resp){
            if(resp.status == 204){

                // remove from selected
                angular.forEach(selectedFiles, function(file, key) {
                    mObj.deleteFile(file);
                });

            }
        });
    };

    this.deleteFolder = function(folder){
        console.log(folder);
    };

}]);