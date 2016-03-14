
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

    // selected folders on page
    var selectedFolders = [];

    // selected files on page
    var selectedFiles = [];

    var selected = false;

    // dummy files
    var files = [
        /*{'id':'1', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},*/
    ];

    // tree
    this.tree = [];

    /**
     * Return root folders
     * @returns {Array}
     */
    this.rootFolders = function(){

        var roots = [];
        for(var i in folders) {
            if(folders[i]['parent'] == 0) roots.push(folders[i]);
        }

        roots = $filter('orderBy')(roots, 'name');

        return roots;
    };

    /**
     * Load files list from api
     * @returns {*}
     */
    this.loadFiles = function(){
        return Drive.listFiles({'maxResults':2000}).then(function(resp){

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

                //if(!data[i]['explicitlyTrashed']){
                    if(data[i]['mimeType']=='application/vnd.google-apps.folder'){
                        if(data[i]['parents'][0]){

                            item['id'] = data[i]['id'];
                            item['name'] = data[i]['title'];
                            item['owner'] = data[i]['ownerNames'].join(', ');
                            item['updateDate'] = (new Date(data[i]['modifiedDate'])).yyyymmdd();
                            item['_updateDate'] = (new Date(data[i]['modifiedDate'])).getTime();
                            item['collapsed'] = true;
                            item['parent'] = data[i]['parents'][0]['isRoot'] ? 0 : data[i]['parents'][0]['id'] ;
                            item['iconLink'] = data[i]['iconLink'];
                            item['selected'] = false;
                            item['size'] = fileSize;
                            item['link'] = data[i]['alternateLink'];
                            item['version'] = data[i]['version'];
                        }

                        if(data[i]['explicitlyTrashed']) item.parent = 'trash';

                        if(!mObj.folder(item['id']) && item['id']){
                            folders.push(item);
                        }

                    }else{
                        if(data[i]['parents'][0] && data[i]['id']){

                            item['id'] = data[i]['id'];
                            item['name'] = data[i]['title'];
                            item['owner'] = data[i]['ownerNames'].join(', ');
                            item['updateDate'] = (new Date(data[i]['modifiedDate'])).yyyymmdd();
                            item['_updateDate'] = (new Date(data[i]['modifiedDate'])).getTime();
                            item['collapsed'] = true;
                            item['folder'] = data[i]['parents'][0]['isRoot'] ? 0 : data[i]['parents'][0]['id'] ;
                            item['isfile'] = true;
                            item['size'] = fileSize;
                            item['iconLink'] = data[i]['iconLink'];
                            item['selected'] = false;
                            item['link'] = data[i]['alternateLink'];
                            item['version'] = data[i]['version'];
                        }
                        if(!mObj.file(item['id'])){
                            if(data[i]['explicitlyTrashed']) item.folder = 'trash';
                            files.push(item);
                        }
                    }
                //}
            }

        });
    };

    /**
     * Update file on drive
     * @param item
     * @returns {*}
     */
    this.updateFile = function(item){
        return Drive.updateFiles(item.id, {title:item.name});
    };

    this.moveFile = function(id, oldparent, newparent){


        Drive.insertParents(id,newparent).then(function(){
            Drive.deleteParents(id, oldparent);
        });

        //console.log(id,oldparent);
        //return Drive.updateFiles(id, {removeParents: oldparent});
    };

    /**
     * Update file localy
     * @param item
     */
    this.updateFileLocaly = function(item){
        var file = mObj.file(item.id);
        file = item;
    };

    /**
     * Update folder localy
     * @param item
     */
    this.updateFolderLocaly = function(item){
        var folder = mObj.folder(item.id);
        folder = item;
    };

    this.downloadSelected = function(){
        /*if(selectedFolders.length > 0){
            console.log('folders');
            return Drive.getParents(selectedFolders[0]['id']);
        }*/
        if(selectedFiles.length > 0){
            console.log('files');
            return Drive.getFiles(selectedFiles[0]['id']);
        }
    };

    /**
     * return selected folders/files
     * @returns {Array}
     */
    this.getSelected = function(){
        if(selectedFiles.length > 0) return selectedFiles;
        if(selectedFolders.length > 0) return selectedFolders;
    };

    /**
     * Load account info from api
     * @returns {*}
     */
    this.loadInfo = function(){
        return Drive.about();
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
        else return [{'id':'0','parent':'0','name':'Min enhet','owner':'me','size':'','updateDate':'', 'collapsed':true}];

        var _b = [];
        _b.push(folder);

        if(folder.parent != 0){
            while(folder.parent != 0) {
                folder = mObj.folder(folder.parent);
                if(folder) _b.push(folder);
                else return _b;
            }
        }

        _b.push({'id':'0','parent':'0','name':'Min enhet','owner':'me','size':'','updateDate':'', 'collapsed':true});

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
     * Return file by id
     * @param fileId
     * @returns {*}
     */
    this.file = function(fileId) {

        fileId = fileId || false;

        if(fileId) {
            for(var _f in files) {
                if(files[_f]['id'] == fileId){
                    return files[_f];
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

        $rootScope.showItemMenu = true;

        folder = folder ? folder : false;

        selectedFolders = [];
        selectedFiles = [];

        if(!folder){
            $rootScope.showItemMenu = false;
            return true;
        }

        selectedFolders.push(folder);
        mObj.selected = folder;

    };

    /**
     * select|deselect file
     * @param file
     */
    this.selectFile = function(file) {

        $rootScope.showItemMenu = true;

        file = file ? file : false;

        selectedFolders = [];
        selectedFiles = [];

        if(!file){
            $rootScope.showItemMenu = false;
            return true;
        }
        selectedFiles.push(file);
        mObj.selected = file;
        //$rootScope.showItemMenu = selectedFiles.length > 0;
    };

    /**
     * Remove all selected files|folders
     */
    this.deleteSelected = function() {

        var res;
        if(selectedFiles.length > 0) {
            return mObj.deleteFile(selectedFiles[0]);
        }
        if(selectedFolders.length > 0) {
            return mObj.deleteFolder(selectedFolders[0]);
        }
        return res;
    };

    /**
     * Remove file via api and from selected list
     * @param file
     * @returns {*}
     */
    this.deleteFile = function(file){
        return Drive.trashFile(file.id);
    };

    /**
     * Remove folder via api and from list
     * @param folder
     */
    this.deleteFolder = function(folder){
        return Drive.trashFile(folder['id']);
    };

    /**
     * Mark file as trash localy
     * @param fileId
     */
    this.moveFileToTrashLocaly = function(fileId){
        selectedFiles = [];
        angular.forEach(files, function(value, key) {
            if(value.id == fileId){
                files[files.indexOf(value)]['folder'] = 'trash';
                files[files.indexOf(value)]['_updateDate'] = (new Date()).getTime();
            }
        });
    };

    /**
     * Mark folder as trash localy
     * @param folderId
     */
    this.moveFolderToTrashLocaly = function(folderId){
        selectedFolders = [];
        angular.forEach(folders, function(value, key) {
            if(value.id == folderId){
                folders[folders.indexOf(value)]['parent'] = 'trash';
                folders[folders.indexOf(value)]['_updateDate'] = (new Date()).getTime();
            }
        });
    };

    /**
     * Create folder via api
     * @param title
     * @param parent
     * @returns {*}
     */
    this.createFolder = function(title, parent){

        parent = parent ? parent : 0;

        var f = {
            'title': title,
            'mimeType':'application/vnd.google-apps.folder'
        };

        if(parent){ f['parents'] = [ {'id' : parent} ]; }

        return Drive.insertFiles(f);
    };

    /**
     * Create folder localy
     */
    this.addFolderLocaly = function(folder){
        folders.push(folder);
    };

    /**
     * Set folder as collapsed
     * @param folderId
     * @returns {boolean}
     */
    this.collapseFolder = function(folderId){

        folderId = folderId || false;

        if(folderId) {
            for(var _f in folders) {
                if(folders[_f]['id'] == folderId){
                    folders[_f]['collapsed'] = true;
                }
            }
            return false;
        }
        return false;

    };

    /**
     * Set folder as expanded
     * @param folderId
     * @returns {boolean}
     */
    this.expandFolder = function(folderId){

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

    }


}]);