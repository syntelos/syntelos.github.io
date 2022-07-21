/*
 * https://www.syntelos.io/recent.js
 * Copyright 2022 John Pritchard (@syntelos)
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

var recent_schedule = 10000;

/*
 * YYYYMMDD symbolic reference to recent_directory source
 * text within "/recent/YYYMMDD.json".
 */
var recent_configuration = null;

/*
 * Array of objects established by "recent.json" and
 * enhanced with element "div" from document.
 */
var recent_directory = null;

/*
 * Timeout ID for UX default auto-paging behavior.
 */
var recent_paging_id = null;

/*
 * UX display re/initialization
 */
function recent_initialize(){

    if (null != recent_directory){

        var children = document.body.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = 0; index < count; index++){

            child = children.item(index);

            if ("page text" == child.className){

                if ("page" == child.id){

                    child.style.visibility = 'visible';
                }
                else {

                    child.style.visibility = 'hidden';
                }
            }
        }

        var count = recent_directory.length;
        var pg;
        var div;

        for (index = 0; index < count; index++){

            pg = recent_directory[index];

            div = document.getElementById(pg.id);

            if (null == div){

                div = document.createElement("div");

                div.id = pg.id;
                div.className = 'page text';
                div.style.visibility = 'hidden';

                dl = document.createElement("dl");
                dl.className = 'text';
                div.appendChild(dl);

                dt = document.createElement("dt");
                dt.className = 'text';
                dl.appendChild(dt);

                if (pg.link && pg.path){

                    a = document.createElement("a");
                    a.className = 'text';
                    a.href = pg.link;

                    if (pg.icon){
                        img = document.createElement("img");
                        img.className  = 'text';
                        img.src = '/images/'+pg.icon+'.svg';

                        a.appendChild(img);
                    }

                    if (pg.path){
                        txt = document.createElement("span");
                        txt.className = 'text';
                        txt.innerText = pg.path;

                        a.appendChild(txt);
                    }

                    dt.appendChild(a);
                }

                dd = document.createElement("dd");
                dd.className = 'text';
                dl.appendChild(dd);

                if (pg.embed){
                    ifr = document.createElement("iframe");
                    ifr.src = pg.embed;
                    ifr.className = 'embed';

                    dd.appendChild(ifr);
                }
                document.body.appendChild(div);
            }

        }

        if (null == recent_paging_id){

            recent_paging_id = setInterval(recent_page_next,recent_schedule);
        }
    }
}

/*
 * UX display navigation
 */
function recent_nav_left (){

    if (recent_paging_id){
        clearInterval(recent_paging_id);
        recent_paging_id = null;
    }

    recent_page_prev();
}

function recent_nav_right (){

    if (recent_paging_id){
        clearInterval(recent_paging_id);
        recent_paging_id = null;
    }

    recent_page_next();
}

/*
 * UX display paging
 */
function recent_page_prev (){

    var prev = false;

    var children = document.body.childNodes;

    var count = children.length;

    for (index = (count-1); index >= 0; index--){

        child = children.item(index);

        if ('page text' == child.className){

            if ('visible' == child.style.visibility){

                child.style.visibility = 'hidden';

                prev = true;
            }
            else if (prev){

                child.style.visibility = 'visible';

                prev = false;

                break;
            }
        }
    }

    if (prev){

        for (index = (count-1); index >= 0; index--){

            child = children.item(index);

            if ('page text' == child.className){

                child.style.visibility = 'visible';

                prev = false;

                break;

            }
        }
    }

}

/*
 * UX display paging
 */
function recent_page_next (){

    var next = false;

    var children = document.body.childNodes;

    var count = children.length;

    for (index = 0; index < count; index++){

        child = children.item(index);

        if ('page text' == child.className){

            if ('visible' == child.style.visibility){

                child.style.visibility = 'hidden';

                next = true;
            }
            else if (next){

                child.style.visibility = 'visible';

                next = false;

                break;
            }
        }
    }

    if (next){

        for (index = 0; index < count; index++){

            child = children.item(index);

            if ('page text' == child.className){

                child.style.visibility = 'visible';

                next = false;

                break;

            }
        }
    }

}

/*
 * Construct 'recent_directory' from
 * '/recent/YYYYMMDD.json'.
 */
function recent_build (){

    var selected = false;

    var select = document.getElementById("directory");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);
            if (option.selected){

                recent_configuration = option.value;

                document.location.hash = option.value;

                selected = true;
            }
        }
    }

    {
        var children = document.body.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = document.body.childNodes.item(index);

            if (null != child && "page text" == child.className && "page" != child.id){

                document.body.removeChild(child);
            }
        }
    }

    if (null != recent_configuration){

        var directory_loader = new XMLHttpRequest();

        directory_loader.open("GET","/recent/"+recent_configuration+".json",true);

        directory_loader.onload = function (e) {

            if (200 == directory_loader.status && null != directory_loader.responseText){

                recent_directory = JSON.parse(directory_loader.responseText);

                recent_initialize();
            }
        };
        directory_loader.send(null);
    }
}

/*
 * Construct 'recent_configuration' from UX, catalog and
 * directory selectors.
 */
function recent_configure (){

    if (null != document.location.hash && 9 == document.location.hash.length){

        recent_configuration = document.location.hash.substring(1,9);
    }

    var configuration_loader = new XMLHttpRequest();
    /*
     * [TODO] catalog
     */
    configuration_loader.open("GET","/recent/index.txt",true);

    configuration_loader.onload = function (e) {

        if (200 == configuration_loader.status && null != configuration_loader.responseText && 8 < configuration_loader.responseText.length){
            /*
             */
            var index_txt = configuration_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_configuration){

                recent_configuration = index_ary[0];
            }
            /*
             * [TODO] catalog
             */
            var catalog = document.getElementById('catalog');
            if (null != catalog){
                var option = document.createElement("option");
                option.className = 'text';
                option.value = "2022";
                option.innerText = "2022";
                option.selected = 'true';

                catalog.appendChild(option);
            }
            /*
             */
            var directory = document.getElementById('directory');
            if (null != directory){

                var selection = false;

                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (8 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == recent_configuration){

                            option.selected = 'true';

                            selection = true;
                        }

                        directory.appendChild(option);
                    }
                }

                if (0 < count && (!selection)){

                    var selected = index_ary[0];

                    recent_configuration = selected;

                    document.location.hash = selected;

                    directory.childNodes.item(0).selected = true;
                }
                else if (document.location.hash){

                    document.location.hash = null;
                }

                directory.onchange = recent_build;
            }

            recent_build();
        }
    };
    configuration_loader.send(null);

}
