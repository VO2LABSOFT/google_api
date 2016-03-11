mainApp.directive('foldersTree', ['gdisk', function (gdisk) {

    return {

        restrict: "EA",

        controller: 'MainController',

        compile: function(element, attributes){
            return {

                pre: function(scope, element, attributes, controller, transcludeFn){

                    /**
                     * Show|hide folder
                     * @param e
                     */
                    scope.toggleFolder = function(e){

                        var folderId = angular.element(e.target).attr('folder-id');

                        if(folderId) {

                            //var _f = gdisk.folder(folderId);
                            var childs = angular.element(e.target).parent().parent().find('ul')[0];
                            childs = angular.element(childs);

                            if(childs.hasClass('hidden')) { // show
                                childs.removeClass('hidden').addClass('visible');// show
                                angular.element(e.target).html("keyboard_arrow_down");
                                //_f.collapsed = false;
                                gdisk.expandFolder(folderId)
                            } else { // hide
                                childs.removeClass('visible').addClass('hidden');
                                angular.element(e.target).html("keyboard_arrow_right");
                                //_f.collapsed = true;
                                gdisk.collapseFolder(folderId);
                            }
                        }
                    };

                    /**
                     * Navigate to folder
                     * @param e
                     */
                    scope.toFolder = function(e){
                        e.preventDefault();
                        document.location.hash = "#/folder/"+angular.element(e.target).attr('folder-id');
                    };

                    /**
                     * Build tree recursive
                     * @param root
                     * @param folders
                     */
                    scope.buildTree = function(root, folders) {

                        for(var i in folders) {

                            var li = angular.element('<li></li>');
                            var lnk = angular.element('<a>');

                            // check childs
                            var childs = gdisk.subFolders(folders[i]['id']);

                            lnk.addClass('mdl-navigation__link');

                            if(childs){
                                if(folders[i]['collapsed']){
                                    lnk.append(
                                        angular.element("<i></i>")
                                            .addClass('material-icons')
                                            .html('keyboard_arrow_right')
                                            .bind("click",scope.toggleFolder)
                                            .attr("folder-id",folders[i]['id']));
                                }else{
                                    lnk.append(
                                        angular.element("<i></i>")
                                            .addClass('material-icons')
                                            .html('keyboard_arrow_down')
                                            .bind("click",scope.toggleFolder)
                                            .attr("folder-id",folders[i]['id']));
                                }

                            }else{
                                lnk.append(
                                    angular.element("<i></i>")
                                        .addClass('spacer'));
                            }

                            lnk.append(
                                    angular.element("<span></span>")
                                        .addClass("mdl-button mdl-js-button mdl-button--icon")
                                        .attr("data-upgraded",",MaterialButton")
                                        .append(
                                        angular.element("<i>")
                                            .addClass("material-icons")
                                            .html("folder")
                                            .bind("click",scope.toFolder)
                                            .attr("folder-id", folders[i]['id'])))
                                    .append(folders[i]['name']);

                            li.append(lnk);

                            if(childs) {
                                var _root = angular.element("<ul></ul>"); // make root
                                if(folders[i]['collapsed']) _root.addClass('hidden');
                                scope.buildTree(_root,childs);
                                li.append(_root);
                            }

                            root.append(li);
                        }
                    }

                },
                post: function(scope, element, attributes, controller, transcludeFn){

                    attributes.$observe('tree', function(value) {

                        var tree = value ? JSON.parse(value) : '';
                        var root = element;

                        angular.element(root).find('li').remove();

                        // build tree
                        if(tree) {
                            var _folders = scope.buildTree(root, tree);
                        }

                        root.append(_folders);

                    });

                }
            }
        }
    }
}]);
