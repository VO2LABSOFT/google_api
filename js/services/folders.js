
'use strict';

mainApp.service('gdisk', function(){

    /**
     * Link to scope
     */
    var mObj = this;

    // dummy folders
    var folders = [
        {'id':'1','parent':'0','name':'Root','owner':'me','size':'','updateDate':'10.10.15'},
        {'id':'2','parent':'1','name':'sub root','owner':'me','size':'','updateDate':'10.10.15' },
        {'id':'3','parent':'1','name':'sub root2','owner':'me','size':'','updateDate':'10.10.15' },
        {'id':'4','parent':'0','name':'Root 2', 'owner': 'me', 'size': '', 'updateDate': '10.10.15'},
        {'id':'5','parent':'4','name':'2 sub root','owner':'me','size':'','updateDate':'10.10.15'},
        {'id':'6','parent':'4','name':'2 sub root2', 'owner': 'me', 'size': '', 'updateDate': '10.10.15'}
    ];

    // dummy files
    var files = [
        {'id':'1', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'2', 'folder':'1', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'3', 'folder':'2', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true},
        {'id':'4', 'folder':'3', 'name':'testFile.txt','owner':'me','size':'100K','updateDate':'10.10.15', 'isfile':true}
    ];

    this.folders = function(folder){
        return folders;
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


});