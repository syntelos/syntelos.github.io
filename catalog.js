/*
 * https://www.syntelos.io/catalog.js
 * Copyright 2022 John Pritchard (@syntelos)
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

/*
 * Paging period in milliseconds.
 */
var catalog_schedule = 10000;
/*
 * <catalog> reference in "/<catalog>/YYYY/MM/".
 */
var catalog_volume = null;
/*
 * YYYY catalog reference in "/catalog/YYYY/MM/YYYMMDD.json".
 */
var catalog_year = null;
/*
 * MM catalog reference in "/catalog/YYYY/MM/YYYMMDD.json".
 */
var catalog_month = null;
/*
 * YYYYMMDD directory reference in
 * "/catalog/YYYY/MM/YYYMMDD.json".
 */
var catalog_directory = null;
/*
 * Interval ID for UX default auto-paging behavior.
 */
var catalog_paging_id = null;

/*
 * <svg#left.navigation:onclick> [UX display navigation]
 */
function catalog_nav_left (){

    catalog_page_manual();

    catalog_page_prev();
}
/*
 * <svg#recycle.navigation:onclick> [UX display navigation]
 */
function catalog_nav_recycle (){

    if (catalog_paging_id){

        catalog_page_manual();
    }
    else {

        catalog_page_begin();

        catalog_page_automatic();
    }
}
/*
 * <svg#right.navigation:onclick> [UX display navigation]
 */
function catalog_nav_right (){

    catalog_page_manual();

    catalog_page_next();
}

/*
 * UX display paging
 */
function catalog_page_automatic(){

    if (! catalog_paging_id){

        catalog_paging_id = setInterval(catalog_page_next,catalog_schedule);

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
 * UX display paging
 */
function catalog_page_manual(){

    if (catalog_paging_id){

        clearInterval(catalog_paging_id);

        catalog_paging_id = null;

        {
            var svg_circle = document.getElementById('recycle_circle');
            var svg_rect = document.getElementById('recycle_rect');

            if (svg_circle && svg_rect){
                svg_circle.style.visibility = 'hidden';
                svg_rect.style.visibility = 'visible';
            }
        }
    }
}
/*
 * UX display paging
 */
function catalog_page_prev (){

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
function catalog_page_begin (){
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
function catalog_page_next (){

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
 * <onchange> from <select#catalog_volume>.
 */
function catalog_select_catalog_volume(){

    var select = document.getElementById("catalog_volume");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 1 < option.value.length){

                catalog_volume = option.value;

                catalog_year = null;

                catalog_month = null;

                catalog_directory = null;
            }
        }
    }

    catalog_configure_year();
}

/*
 * <onchange> from <select#catalog_year>.
 */
function catalog_select_catalog_year(){

    var select = document.getElementById("catalog_year");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 4 == option.value.length){

                catalog_year = option.value;

                catalog_month = null;

                catalog_directory = null;
            }
        }
    }

    catalog_configure_month();
}

/*
 * <onchange> from <select#catalog_month>.
 */
function catalog_select_catalog_month(){

    var select = document.getElementById("catalog_month");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 2 == option.value.length){

                catalog_month = option.value;

                catalog_directory = null;
            }
        }
    }

    catalog_configure_directory();
}

/*
 * <onchange> from <select#directory>.
 */
function catalog_select_catalog_directory(){

    var select = document.getElementById("catalog_directory");
    if (select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);
            if (option.selected && null != option.value){

                catalog_directory = option.value;

                document.location.hash = catalog_volume+'-'+catalog_directory;
            }
        }
    }

    catalog_configure_pages();
}

/*
 * Document body <onload>.
 */
function catalog_configure(){

    if (null != document.location.hash && 0 != document.location.hash.length){
	var anchor = document.location.hash;
	var anchor_index = anchor.indexOf('-');
	if (0 < anchor_index){
	    catalog_volume = anchor.substring(1,anchor_index);
            catalog_directory = anchor.substring(anchor_index+1,anchor.length);
            catalog_year = catalog_directory.substring(0,4);
            catalog_month = catalog_directory.substring(4,6);
	}
	else {
            catalog_volume = 'recent';
            catalog_directory = anchor.substring(1,9);
            catalog_year = catalog_directory.substring(0,4);
            catalog_month = catalog_directory.substring(4,6);
	}
    }

    catalog_configure_volume();

}

/*
 * First part of catalog configuration from <onload>.
 */
function catalog_configure_volume(){

    var catalog_volume_loader = new XMLHttpRequest();

    var catalog_volume_reference = "/index.txt";

    catalog_volume_loader.open("GET",catalog_volume_reference,false);

    catalog_volume_loader.onload = function (e) {

        if (4 == catalog_volume_loader.readyState && 200 == catalog_volume_loader.status &&
            null != catalog_volume_loader.responseText && 4 < catalog_volume_loader.responseText.length)
        {
            /*
             */
            var index_txt = catalog_volume_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == catalog_volume){

                catalog_volume = index_ary[0];

                catalog_year = null;
                catalog_month = null;
                catalog_directory = null;
            }
            /*
             */
            var select = document.getElementById('catalog_volume');
            if (null != select){
                {
                    var children = select.childNodes;
                    var count = children.length;
                    var index;
                    var child;

                    for (index = (count-1); 0 <= index; index--){

                        child = children.item(index);

                        select.removeChild(child);
                    }
                }
                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (1 < index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == catalog_volume){

                            option.selected = 'true';
                        }

                        select.appendChild(option);
                    }
                }

                select.onchange = catalog_select_catalog_volume;
            }

            catalog_configure_year();
        }
    };
    catalog_volume_loader.send(null);

}

/*
 * Second part of catalog configuration from <onload>.
 */
function catalog_configure_year(){

    var catalog_year_loader = new XMLHttpRequest();

    var catalog_year_reference = "/"+catalog_volume+"/index.txt";

    catalog_year_loader.open("GET",catalog_year_reference,false);

    catalog_year_loader.onload = function (e) {

        if (4 == catalog_year_loader.readyState && 200 == catalog_year_loader.status &&
            null != catalog_year_loader.responseText && 4 < catalog_year_loader.responseText.length)
        {
            /*
             */
            var index_txt = catalog_year_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == catalog_year){

                catalog_year = index_ary[0];

                catalog_month = null;

                catalog_directory = null;
            }
            /*
             */
            var select = document.getElementById('catalog_year');
            if (null != select){
                {
                    var children = select.childNodes;
                    var count = children.length;
                    var index;
                    var child;

                    for (index = (count-1); 0 <= index; index--){

                        child = children.item(index);

                        select.removeChild(child);
                    }
                }
                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (4 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == catalog_year){

                            option.selected = 'true';
                        }

                        select.appendChild(option);
                    }
                }

                select.onchange = catalog_select_catalog_year;
            }

            catalog_configure_month();
        }
    };
    catalog_year_loader.send(null);

}

/*
 * Third part of catalog configuration from <onload>, and
 * <onchange> effect.
 */
function catalog_configure_month(){

    var catalog_month_loader = new XMLHttpRequest();

    var catalog_month_reference = "/"+catalog_volume+"/"+catalog_year+"/index.txt";

    catalog_month_loader.open("GET",catalog_month_reference,false);

    catalog_month_loader.onload = function (e) {

        if (4 == catalog_month_loader.readyState && 200 == catalog_month_loader.status &&
            null != catalog_month_loader.responseText && 2 < catalog_month_loader.responseText.length)
        {
            /*
             */
            var index_txt = catalog_month_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == catalog_month){

                catalog_month = index_ary[0];

                catalog_directory = null;
            }
            /*
             */
            var select = document.getElementById('catalog_month');
            if (null != select){
                {
                    var children = select.childNodes;
                    var count = children.length;
                    var index;
                    var child;

                    for (index = (count-1); 0 <= index; index--){

                        child = children.item(index);

                        select.removeChild(child);
                    }
                }
                var count = index_ary.length;
                var index;
                for (index = 0; index < count; index++){

                    var index_value = index_ary[index];
                    if (2 == index_value.length){

                        var option = document.createElement("option");
                        option.className = 'text';
                        option.value = index_value;
                        option.innerText = index_value;

                        if (index_value == select){

                            option.selected = 'true';
                        }

                        select.appendChild(option);
                    }
                }

                select.onchange = catalog_select_catalog_month;
            }

            catalog_configure_directory();
        }
    };
    catalog_month_loader.send(null);

}

/*
 * UX constructor called from body <onload> and catalog_year <select>.
 */
function catalog_configure_directory(){

    var select = document.getElementById('catalog_directory');
    if (null != select){

        var children = select.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = children.item(index);

            select.removeChild(child);
        }
    }

    var catalog_directory_loader = new XMLHttpRequest();

    var catalog_directory_reference = "/"+catalog_volume+"/"+catalog_year+'/'+catalog_month+"/index.txt";

    catalog_directory_loader.open("GET",catalog_directory_reference,false);

    catalog_directory_loader.onload = function (e) {

        if (4 == catalog_directory_loader.readyState && 200 == catalog_directory_loader.status &&
            null != catalog_directory_loader.responseText && 8 < catalog_directory_loader.responseText.length)
        {
            var index_txt = catalog_directory_loader.responseText;
            var index_ary = index_txt.split('\n');

            if (null == catalog_directory){

                catalog_directory = index_ary[0];

                document.location.hash = catalog_volume+'-'+catalog_directory;
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

                    if (index_value == catalog_directory){

                        option.selected = 'true';
                    }

                    select.appendChild(option);
                }
            }

            select.onchange = catalog_select_catalog_directory;

            catalog_configure_pages();
        }
    };
    catalog_directory_loader.send(null);

}

/*
 * UX constructor called from directory <onchange> and
 * construction.
 */
function catalog_configure_pages(){
    {
        var children = document.body.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = children.item(index);

            if (null != child && "page text" == child.className){

		if ("page" == child.id){

		    child.style.visibility = 'visible';
		}
		else {
                    document.body.removeChild(child);
		}
            }
        }
    }

    var catalog_pages_loader = new XMLHttpRequest();

    var catalog_pages_reference = "/"+catalog_volume+"/"+catalog_year+'/'+catalog_month+'/'+catalog_directory+".json";

    catalog_pages_loader.open("GET",catalog_pages_reference,false);

    catalog_pages_loader.onload = function (e) {

        if (4 == catalog_pages_loader.readyState && 200 == catalog_pages_loader.status &&
            null != catalog_pages_loader.responseText)
        {
            var directory = JSON.parse(catalog_pages_loader.responseText);
            var count = directory.length;
            var index;
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
                    dl.className = 'catalog';
                    div.appendChild(dl);

                    dt = document.createElement("dt");
                    dt.className = 'catalog';
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
                    dd.className = 'catalog';
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

            if (null == catalog_paging_id){

                catalog_paging_id = setInterval(catalog_page_next,catalog_schedule);
            }
        }
    };
    catalog_pages_loader.send(null);

}
