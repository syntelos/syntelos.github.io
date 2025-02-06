/*
 * https://www.syntelos.io/catalog.js
 * Copyright 2023 John Douglas Pritchard, Syntelos
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

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
 * URL path identity including hyphen and underscore
 * delimited from remainder by forward solidus '/'.
 */
var catalog_identifier = null;

/*
 * Automatic paging initial behavior.
 */
var catalog_paging_automatic_state = true;
/*
 * Automatic paging period in milliseconds.
 */
var catalog_paging_automatic_schedule = 10000;
/*
 * Automatic paging Interval ID.
 */
var catalog_paging_automatic_interval = null;

/*
 * Define document location from page state.
 */
function document_location_hash_put(){
    if (null != catalog_volume && null != catalog_directory && null != catalog_identifier){

	var reference = (catalog_volume+'/'+catalog_directory+'/'+catalog_identifier);

	document.location.hash = encodeURI(reference);

	return true;
    }
    else {
	document.location.hash = "";

	return false;
    }
}
/*
 * Derive page state from document location.
 */
function document_location_hash_get(){
    if (null != document.location.hash && 0 != document.location.hash.length){
	var anchor = decodeURI(document.location.hash);
	if ('#' == anchor[0]){
	    anchor = anchor.substring(1,anchor.length)
	}
	var anchor_list = anchor.split('/');
	if (3 == anchor_list.length){

	    catalog_volume = anchor_list[0];
	    catalog_directory = anchor_list[1];
	    catalog_identifier = anchor_list[2];

	    if (8 == catalog_directory.length){
		try {
		    catalog_year = catalog_directory.substring(0,4);

		    catalog_month = catalog_directory.substring(4,6);

		    return true;

		} catch (e){
		    console.error(e)
		}
	    } else {
		console.error('[catalog_directory] '+catalog_directory)
	    }
	}
    }
    return false;
}
/*
 * Produce document hash reference from page state and
 * argument identifier.
 */
function document_location_hash_did(id){

    if (catalog_volume && catalog_directory && id){

	return encodeURI('#'+catalog_volume+'/'+catalog_directory+'/'+pg.id);
    } else {
	return ""
    }
}
/*
 * Update page state with identifier and produce document 
 * location.
 */
function document_location_hash_nav(id){

    if (catalog_volume && catalog_directory && id){

	catalog_identifier = id;
    }

    return document_location_hash_put();
}

/*
 * Perform U/I update in worker thread.
 */
function gui_sync(){

    if (null != catalog_identifier){
	/*
	 * Selector
	 */
	try {
	    var select = document.getElementById("catalog_identifier");
	    if (select && select.hasChildNodes()){

		var children = select.childNodes;
		var count = children.length;
		var index;
		var option;

		for (index = 0; index < count; index++){

		    option = children.item(index);

		    option.selected = (catalog_identifier == option.value);
		}
	    }
	} catch (e){
	    console.error(e)
	}
	/*
	 * Selection
	 */
	try {
	    var children = document.body.childNodes;

	    var count = children.length;

	    for (index = 0; index < count; index++){

		child = children.item(index);

		if ('page text' == child.className){

		    if (catalog_identifier == child.id){

			child.style.visibility = 'visible';
		    }
		    else {

			child.style.visibility = 'hidden';
		    }
		}
	    }
	} catch (e){
	    console.error(e)
	}
    }
}

/*
 * <svg#left.navigation:onclick> [UX display navigation]
 */
function catalog_nav_left (){

    catalog_paging_manual();

    catalog_page_prev();

    return true
}
/*
 * <svg#recycle.navigation:onclick> [UX display navigation]
 */
function catalog_nav_recycle (){

    if (catalog_paging_automatic_interval){

        catalog_paging_manual();
    }
    else {

        catalog_page_begin();

        catalog_paging_automatic();
    }
    return true
}
/*
 * <svg#right.navigation:onclick> [UX display navigation]
 */
function catalog_nav_right (){

    catalog_paging_manual();

    catalog_page_next();

    return true
}
/*
 * The "hashchange" event listener functions in the page
 * state realm, needing to synchronize the selector and the
 * selection with the document location hash.
 */
function catalog_nav_hashchange(e){
    /*
     * Location
     */
    if (null != document.location.hash && 0 != document.location.hash.length){
	var anchor = decodeURI(document.location.hash);
	if ('#' == anchor[0]){
	    anchor = anchor.substring(1,anchor.length);
	}
	var anchor_list = anchor.split('/');
	if (3 == anchor_list.length){

	    var volume = anchor_list[0];
	    var directory = anchor_list[1];
	    var identifier = anchor_list[2];

	    if (volume == catalog_volume && directory == catalog_directory){
		catalog_identifier = identifier;

		gui_sync();
	    }
	}
    } 
    return true
}
/*
 * The "keypress" event listener functions in the page
 * state realm, needing to synchronize the selector and the
 * selection with the document location hash.
 */
function catalog_nav_keypress(e){

    switch (e.key){

    case "Home":
    case "Up":
    case "Left":
    case "PageUp":
    case "<":
    case "ArrowUp":
    case "ArrowLeft":
	return catalog_nav_left()

    case "End":
    case "PageDown":
    case "Down":
    case "Right":
    case "Enter":
    case ">":
    case "ArrowDown":
    case "ArrowRight":
	return catalog_nav_right()

    default:
	return catalog_nav_recycle()
    }
}
/*
 * UX display paging
 */
function catalog_paging_begin(){

    if (catalog_paging_automatic_state){

	catalog_paging_automatic()

    } else {

	catalog_paging_manual()
    }
}
/*
 * UX display paging
 */
function catalog_paging_automatic(){

    if (null == catalog_paging_automatic_interval){

        catalog_paging_automatic_interval = setInterval(catalog_page_next,catalog_paging_automatic_schedule);
    }
    try {
        var svg_circle = document.getElementById('recycle_circle');
        var svg_rect = document.getElementById('recycle_rect');

        if (svg_circle && svg_rect){
            svg_circle.style.visibility = 'visible';
            svg_rect.style.visibility = 'hidden';
        }
    } catch (e){
	console.error(e)
    }
}
/*
 * UX display paging
 */
function catalog_paging_manual(){

    if (null != catalog_paging_automatic_interval){

        clearInterval(catalog_paging_automatic_interval);

        catalog_paging_automatic_interval = null;
    }
    try {
        var svg_circle = document.getElementById('recycle_circle');
        var svg_rect = document.getElementById('recycle_rect');

        if (svg_circle && svg_rect){
            svg_circle.style.visibility = 'hidden';
            svg_rect.style.visibility = 'visible';
        }
    } catch (e){
	console.error(e)
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

                prev = true;
            }
            else if (prev){

		document_location_hash_nav(child.id)

                prev = false;

                break;
            }
        }
    }

    if (prev){

        for (index = (count-1); index >= 0; index--){

            child = children.item(index);

            if ('page text' == child.className){

		document_location_hash_nav(child.id)

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

    if (document_location_hash_get() || document_location_hash_put()){

	gui_sync();

	return true;

    } else {

	return document_location_hash_nav('list')
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

		document_location_hash_nav(child.id)

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

		document_location_hash_nav(child.id)

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
    catalog_paging_manual();

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

		catalog_identifier = null;

		document_location_hash_put();
            }
        }
    }

    catalog_configure_year();
}

/*
 * <onchange> from <select#catalog_year>.
 */
function catalog_select_catalog_year(){
    catalog_paging_manual();

    var select = document.getElementById("catalog_year");
    if (select && select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 4 == option.value.length){

                catalog_year = option.value;

                catalog_month = null;

                catalog_directory = null;

		catalog_identifier = null;

		document_location_hash_put();
            }
        }
    }

    catalog_configure_month();
}

/*
 * <onchange> from <select#catalog_month>.
 */
function catalog_select_catalog_month(){
    catalog_paging_manual();

    var select = document.getElementById("catalog_month");
    if (select && select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);

            if (option.selected && null != option.value && 2 == option.value.length){

                catalog_month = option.value;

                catalog_directory = null;

		catalog_identifier = null;

		document_location_hash_put();
            }
        }
    }

    catalog_configure_directory();
}

/*
 * <onchange> from <select#directory>.
 */
function catalog_select_catalog_directory(){
    catalog_paging_manual();

    var select = document.getElementById("catalog_directory");
    if (select && select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);
            if (option.selected){

                catalog_directory = option.value;

		catalog_identifier = null;

		document_location_hash_put();
            }
        }
    }

    catalog_configure_pages();
}

/*
 * <onchange> from <select#directory>.
 */
function catalog_select_catalog_identifier(){
    catalog_paging_manual();

    var select = document.getElementById("catalog_identifier");
    if (select && select.hasChildNodes()){

        var children = select.childNodes;
        var count = children.length;
        var index;
        for (index = 0; index < count; index++){

            var option = children.item(index);
            if (option.selected){

		catalog_identifier = option.value;

                document_location_hash_put();
	    }
	}
    }
}

/*
 * Document body <onload>.
 */
function catalog_configure(){

    window.onhashchange = catalog_nav_hashchange

    document.body.onkeypress = catalog_nav_keypress

    catalog_paging_manual();

    catalog_paging_automatic_state = (!document_location_hash_get());

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
	    }
            /*
             */
            var select = document.getElementById('catalog_volume');
            if (null != select){
                try {
                    var children = select.childNodes;
                    var count = children.length;
                    var index;
                    var child;

                    for (index = (count-1); 0 <= index; index--){

                        child = children.item(index);

                        select.removeChild(child);
                    }
                } catch (e){
		    console.error(e)
		}
		try {
                    var count = index_ary.length;
                    var index;
                    for (index = 0; index < count; index++){

			var index_value = index_ary[index];
			if (1 < index_value.length){

                            var option = document.createElement("option");
                            option.className = 'text';
                            option.value = index_value;
                            option.innerText = index_value;

                            option.selected = (index_value == catalog_volume);

                            select.appendChild(option);
			}
                    }
		} catch (e){
		    console.error(e)
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

    if (catalog_volume){

	var catalog_year_loader = new XMLHttpRequest();

	var catalog_year_reference = encodeURI("/"+catalog_volume+"/index.txt");

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
		}
		/*
		 */
		var select = document.getElementById('catalog_year');
		if (null != select){
                    try {
			var children = select.childNodes;
			var count = children.length;
			var index;
			var child;

			for (index = (count-1); 0 <= index; index--){

                            child = children.item(index);

                            select.removeChild(child);
			}
                    } catch (e){
			console.error(e)
		    }
		    try {
			var count = index_ary.length;
			var index;
			for (index = 0; index < count; index++){

			    var index_value = index_ary[index];
			    if (4 == index_value.length){

				var option = document.createElement("option");
				option.className = 'text';
				option.value = index_value;
				option.innerText = index_value;

				option.selected = (index_value == catalog_year);

				select.appendChild(option);
			    }
			}
		    } catch (e){
			console.error(e)
		    }
                    select.onchange = catalog_select_catalog_year;
		}

		catalog_configure_month();
            }
	};
	catalog_year_loader.send(null);
    }
}

/*
 * Third part of catalog configuration from <onload>, and
 * <onchange> effect.
 */
function catalog_configure_month(){

    if (catalog_volume && catalog_year){
	
	var catalog_month_loader = new XMLHttpRequest();

	var catalog_month_reference = encodeURI("/"+catalog_volume+"/"+catalog_year+"/index.txt");

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
		}
		/*
		 */
		var select = document.getElementById('catalog_month');
		if (null != select){
                    try {
			var children = select.childNodes;
			var count = children.length;
			var index;
			var child;

			for (index = (count-1); 0 <= index; index--){

                            child = children.item(index);

                            select.removeChild(child);
			}
                    } catch (e){
			console.error(e)
		    }
		    try {
			var count = index_ary.length;
			var index;
			for (index = 0; index < count; index++){

			    var index_value = index_ary[index];
			    if (2 == index_value.length){

				var option = document.createElement("option");
				option.className = 'text';
				option.value = index_value;
				option.innerText = index_value;

				option.selected = (index_value == select);

				select.appendChild(option);
			    }
			}
		    } catch (e){
			console.error(e)
		    }
                    select.onchange = catalog_select_catalog_month;
		}

		catalog_configure_directory();
            }
	};
	catalog_month_loader.send(null);
    }
}

/*
 * UX constructor called from body <onload> and catalog_year <select>.
 */
function catalog_configure_directory(){

    if (catalog_volume && catalog_year && catalog_month){
	
	var catalog_directory_loader = new XMLHttpRequest();

	var catalog_directory_reference = encodeURI("/"+catalog_volume+"/"+catalog_year+'/'+catalog_month+"/index.txt");

	catalog_directory_loader.open("GET",catalog_directory_reference,false);

	catalog_directory_loader.onload = function (e) {

            if (4 == catalog_directory_loader.readyState && 200 == catalog_directory_loader.status &&
		null != catalog_directory_loader.responseText && 8 < catalog_directory_loader.responseText.length)
            {
		/*
		 */
		var index_txt = catalog_directory_loader.responseText;
		var index_ary = index_txt.split('\n');

		if (null == catalog_directory){

                    catalog_directory = index_ary[0];
		}
		/*
		 */
		var select = document.getElementById('catalog_directory');
		if (null != select){
		    try {
			var children = select.childNodes;
			var count = children.length;
			var index;
			var child;

			for (index = (count-1); 0 <= index; index--){

			    child = children.item(index);

			    select.removeChild(child);
			}
		    } catch (e){
			console.error(e)
		    }
		    try {
			var count = index_ary.length;
			var index;
			for (index = 0; index < count; index++){

			    var index_value = index_ary[index];
			    if (8 == index_value.length){

				var option = document.createElement("option");
				option.className = 'text';
				option.value = index_value;
				option.innerText = index_value;

				option.selected = (index_value == catalog_directory);

				select.appendChild(option);
			    }
			}
		    } catch (e){
			console.error(e)
		    }
		    select.onchange = catalog_select_catalog_directory;
		}

		catalog_configure_pages();
            }
	};
	catalog_directory_loader.send(null);
    }
}

/*
 * UX constructor called from directory <onchange> and
 * construction.
 */
function catalog_configure_pages(){
    try {
        var children = document.body.childNodes;
        var count = children.length;
        var index;
        var child;

        for (index = (count-1); 0 <= index; index--){

            child = children.item(index);

            if (null != child && "page text" == child.className){

		if ("list" == child.id){

		    child.style.visibility = 'visible';
		}
		else {
                    document.body.removeChild(child);
		}
            }
        }
    } catch (e){
	console.error(e)
    }

    if (catalog_volume && catalog_year && catalog_month && catalog_directory ){

	var catalog_pages_loader = new XMLHttpRequest();

	var catalog_pages_reference = encodeURI("/"+catalog_volume+"/"+catalog_year+'/'+catalog_month+'/'+catalog_directory+".json");

	catalog_pages_loader.open("GET",catalog_pages_reference,false);

	catalog_pages_loader.onload = function (e) {

            if (4 == catalog_pages_loader.readyState &&
		200 == catalog_pages_loader.status)
            {
		try {
		    var directory = JSON.parse(catalog_pages_loader.responseText);

		    catalog_configure_pages_construct_select(directory)

		    catalog_configure_pages_construct_frames(directory)

		    catalog_page_begin()

		    catalog_paging_begin()

		} catch (e){
		    console.error(catalog_pages_reference+' '+e)
		}
            } else {
		console.log(catalog_pages_reference+" (state: "+catalog_pages_loader.readyState+", status: "+catalog_pages_loader.status+")")
	    }
	};
	catalog_pages_loader.send(null);
    }
}

/*
 */
function catalog_configure_pages_construct_select(directory){
    var select = document.getElementById('catalog_identifier');
    if (select){
        try {
            var children = select.childNodes;
            var count = children.length;
            var index;
            var child;

            for (index = (count-1); 0 <= index; index--){

                child = children.item(index);

                select.removeChild(child);
            }
        } catch (e){
	    console.error(e)
	}
	try {
            var count = directory.length;
            var index;
            for (index = 0; index < count; index++){
		pg = directory[index]

		if (pg && pg.id){
		    var option = document.createElement("option");
		    option.className = 'text';
		    option.value = pg.id;

		    if (pg.name){
			option.innerText = selectify_name(pg.name);
		    } else {
			option.innerText = pg.id;
		    }

                    option.selected = (pg.id == catalog_identifier);

		    select.appendChild(option);
		}
            }
	} catch (e){
	    console.error(e)
	}
        select.onchange = catalog_select_catalog_identifier;
    }
}

/*
 */
function catalog_configure_pages_construct_frames(directory){
    var count = directory.length;
    var index;

    for (index = 0; index < count; index++){
	pg = directory[index]

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
}

/*
 * Convert filename to familiar path representation.
 */
function pathify_name(name){

    if (name){
	var head = name
	try {
	    head = name.split('.')[0]
	} catch (e){
	}

	var list = head.split('-')
	if (list){
	    var count = list.length
	    var x
	    var z = list.length
	    var path = ''

	    for (x = 0; x < z; x++) {

		p = list[x]

		if (p.match(/[0-9]/)){
		    break
		} else {
		    if (path){
			path += ' '
		    }
		    path += ('/'+p)
		}
	    }
	    return path
	}
    }
    return name
}

/*
* Heuristic selector.
 */
function selectify_name(name){

    if (name){
	var list = name.split('-')

	if (list && 0 < list.length){
	    var x = 0
	    var z = list.length

	    if (3 < z){

		x = (z-3)
	    }
	    else if (2 < z){

		x = (z-2)
	    }
	    else if (1 < z){

		x = 1
	    }

	    return list[x]
	}
    }
    return name
}
