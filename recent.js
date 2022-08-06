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
 * YYYY catalog reference in "/recent/YYYY/MM/YYYMMDD.json".
 */
var recent_catalog_year = null;
/*
 * MM catalog reference in "/recent/YYYY/MM/YYYMMDD.json".
 */
var recent_catalog_month = null;
/*
 * YYYYMMDD directory reference in
 * "/recent/YYYY/MM/YYYMMDD.json".
 */
var recent_directory = null;
/*
 * Interval ID for UX default auto-paging behavior.
 */
var recent_paging_id = null;

/*
 * <svg#left.navigation:onclick> [UX display navigation]
 */
function recent_nav_left (){

    if (recent_paging_id){
        clearInterval(recent_paging_id);
        recent_paging_id = null;
    }

    recent_page_prev();
}

/*
 * <svg#recycle.navigation:onclick> [UX display navigation]
 */
function recent_nav_recycle (){

    if (recent_paging_id){

        clearInterval(recent_paging_id);

        recent_paging_id = null;

        {
            var svg_circle = document.getElementById('recycle_circle');
            var svg_rect = document.getElementById('recycle_rect');

            if (svg_circle && svg_rect){
                svg_circle.style.visibility = 'hidden';
                svg_rect.style.visibility = 'visible';
            }
        }
    }
    else {

        recent_page_begin();

        recent_paging_id = setInterval(recent_page_next,recent_schedule);

        {
            var svg_circle = document.getElementById('recycle_circle');
            var svg_rect = document.getElementById('recycle_rect');

            if (svg_circle && svg_rect){
                svg_circle.style.visibility = 'visible';
                svg_rect.style.visibility = 'hidden';
            }
        }
    }
}

/*
 * <svg#right.navigation:onclick> [UX display navigation]
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
 * <onchange> from <select#catalog_year>.
 */
function recent_select_catalog_year(){

    var select = document.getElementById("catalog_year");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 4 == option.value.length){

                recent_catalog_year = option.value;

                recent_catalog_month = null;

                recent_directory = null;
            }
        }
    }

    recent_configure_catalog_month();
}

/*
 * <onchange> from <select#catalog_month>.
 */
function recent_select_catalog_month(){

    var select = document.getElementById("catalog_month");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 2 == option.value.length){

                recent_catalog_month = option.value;

                recent_directory = null;
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
            if (option.selected && null != option.value){

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

    if (null != document.location.hash && 9 == document.location.hash.length){

        recent_directory = document.location.hash.substring(1,9);
        recent_catalog_year = recent_directory.substring(0,4);
        recent_catalog_month = recent_directory.substring(4,6);
    }

    recent_configure_catalog_year();

}

/*
 * First part of catalog configuration from <onload>.
 */
function recent_configure_catalog_year(){

    var catalog_year_loader = new XMLHttpRequest();

    catalog_year_loader.open("GET","/recent/index.txt",true);

    catalog_year_loader.onload = function (e) {

        if (200 == catalog_year_loader.status && null != catalog_year_loader.responseText && 4 < catalog_year_loader.responseText.length){
            /*
             */
            var index_txt = catalog_year_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_catalog_year){

                recent_catalog_year = index_ary[0];

                recent_catalog_month = null;

                recent_directory = null;
            }
            /*
             */
            var catalog_year = document.getElementById('catalog_year');
            if (null != catalog_year){

                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (4 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == recent_catalog_year){

                            option.selected = 'true';
                        }

                        catalog_year.appendChild(option);
                    }
                }

                catalog_year.onchange = recent_select_catalog_year;
            }

            recent_configure_catalog_month();
        }
    };
    catalog_year_loader.send(null);

}

/*
 * Second part of catalog configuration from <onload>, and
 * <onchange> effect.
 */
function recent_configure_catalog_month(){

    var catalog_month_loader = new XMLHttpRequest();

    catalog_month_loader.open("GET","/recent/"+recent_catalog_year+"/index.txt",true);

    catalog_month_loader.onload = function (e) {

        if (200 == catalog_month_loader.status && null != catalog_month_loader.responseText && 2 < catalog_month_loader.responseText.length){
            /*
             */
            var index_txt = catalog_month_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_catalog_month){

                recent_catalog_month = index_ary[0];

                recent_directory = null;
            }
            /*
             */
            var catalog_month = document.getElementById('catalog_month');
            if (null != catalog_month){

                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (2 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == recent_catalog_month){

                            option.selected = 'true';
                        }

                        catalog_month.appendChild(option);
                    }
                }

                catalog_month.onchange = recent_select_catalog_month;
            }

            recent_configure_directory();
        }
    };
    catalog_month_loader.send(null);

}

/*
 * UX constructor called from body <onload> and catalog_year <select>.
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

    directory_loader.open("GET","/recent/"+recent_catalog_year+'/'+recent_catalog_month+"/index.txt",true);

    directory_loader.onload = function (e) {

        if (200 == directory_loader.status && null != directory_loader.responseText && 8 < directory_loader.responseText.length){

            var index_txt = directory_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == recent_directory){

                recent_directory = index_ary[0];

                document.location.hash = recent_directory;
            }

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
                    }

                    directory.appendChild(option);
                }
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

    var pages_loader = new XMLHttpRequest();

    pages_loader.open("GET","/recent/"+recent_catalog_year+'/'+recent_catalog_month+'/'+recent_directory+".json",true);

    pages_loader.onload = function (e) {

        if (200 == pages_loader.status && null != pages_loader.responseText){

            var directory = JSON.parse(pages_loader.responseText);

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
                    dl.className = 'recent';
                    div.appendChild(dl);

                    dt = document.createElement("dt");
                    dt.className = 'recent';
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
                    dd.className = 'recent';
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
    pages_loader.send(null);

}
