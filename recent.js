/*
 * https://www.syntelos.io/recent.js
 * Copyright 2022 John Pritchard (@syntelos)
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

/*
 * Paging period in milliseconds.
 */
var recent_schedule = 10000;
/*
 * YYYY catalog reference in "/recent/YYYY/YYYMMDD.json".
 */
var recent_catalog = '2022';
/*
 * YYYYMMDD directory reference in
 * "/recent/YYYY/YYYMMDD.json".
 */
var recent_directory = null;
/*
 * Timeout ID for UX default auto-paging behavior.
 */
var recent_paging_id = null;

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

/*
 * UX display navigation
 */
function recent_nav_recycle (){

    if (recent_paging_id){
        clearInterval(recent_paging_id);
        recent_paging_id = null;
    }

    recent_page_begin();

    if (null == recent_paging_id){

        recent_paging_id = setInterval(recent_page_next,recent_schedule);
    }
}

/*
 * UX display navigation
 */
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
function recent_page_begin (){
    var children = document.body.childNodes;
    var count = children.length;

    for (index = 0; index < count; index++){

        child = children.item(index);

        if ('page text' == child.className){

            if ('page' == child.id){

                child.style.visibility = 'visible';
            }
            else {

                child.style.visibility = 'hidden';
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
 * <onchange> from <select#catalog>.
 */
function recent_select_catalog(){

    var select = document.getElementById("catalog");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 4 == option.value.length){

                recent_catalog = option.value;
            }
        }
    }

    recent_configure_directory();
}

/*
 * <onchange> from <select#directory>.
 */
function recent_select_directory(){

    var select = document.getElementById("directory");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);
            if (option.selected){

                recent_directory = option.value;

                document.location.hash = option.value;
            }
        }
    }

    recent_configure_pages();
}

/*
 * Document body <onload>.
 */
function recent_configure(){
    /*
     */
    if (null != document.location.hash && 9 == document.location.hash.length){

        recent_directory = document.location.hash.substring(1,9);
    }
    /*
     */
    var catalog_loader = new XMLHttpRequest();

    catalog_loader.open("GET","/recent/index.txt",true);

    catalog_loader.onload = function (e) {

        if (200 == catalog_loader.status && null != catalog_loader.responseText && 4 < catalog_loader.responseText.length){
            /*
             */
            var index_txt = catalog_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_catalog){

                recent_catalog = index_ary[0];
            }
            /*
             */
            var catalog = document.getElementById('catalog');
            if (null != catalog){

                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (4 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == recent_catalog){

                            option.selected = 'true';
                        }

                        catalog.appendChild(option);
                    }
                }

                catalog.onchange = recent_select_catalog;
            }

            recent_configure_directory();
        }
    };
    catalog_loader.send(null);
}

/*
 * UX constructor called from body <onload> and catalog <select>.
 */
function recent_configure_directory(){

    var directory = document.getElementById('directory');
    if (null != directory){

        var children = directory.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = children.item(index);

            directory.removeChild(child);
        }
    }
    var directory_loader = new XMLHttpRequest();

    directory_loader.open("GET","/recent/"+recent_catalog+"/index.txt",true);

    directory_loader.onload = function (e) {

        if (200 == directory_loader.status && null != directory_loader.responseText && 8 < directory_loader.responseText.length){

            var index_txt = directory_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_directory){

                recent_directory = index_ary[0];
            }

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

                    if (index_value == recent_directory){

                        option.selected = 'true';

                        selection = true;
                    }

                    directory.appendChild(option);
                }
            }

            if (0 < count && (!selection)){

                var selected = index_ary[0];

                recent_directory = selected;

                document.location.hash = selected;

                directory.childNodes.item(0).selected = true;
            }
            else if (document.location.hash){

                document.location.hash = null;
            }

            directory.onchange = recent_select_directory;

            recent_configure_pages();
        }
    };
    directory_loader.send(null);

}

/*
 * UX constructor called from directory <onchange> and
 * construction.
 */
function recent_configure_pages(){
    {
        var children = document.body.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = children.item(index);

            if (null != child && "page text" == child.className && "page" != child.id){

                document.body.removeChild(child);
            }
        }
    }

    if (null != recent_catalog && null != recent_directory){

        var directory_loader = new XMLHttpRequest();

        directory_loader.open("GET","/recent/"+recent_catalog+'/'+recent_directory+".json",true);

        directory_loader.onload = function (e) {

            if (200 == directory_loader.status && null != directory_loader.responseText){

                var directory = JSON.parse(directory_loader.responseText);

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

                var count = directory.length;
                var pg;
                var div;

                for (index = 0; index < count; index++){

                    pg = directory[index];

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
        };
        directory_loader.send(null);
    }
}
