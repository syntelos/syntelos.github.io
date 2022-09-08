/*
 * https://www.syntelos.io/collections/collections.js
 * Copyright 2022 John Pritchard (@syntelos)
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

/*
 */
var collection_yyyy = null;
/*
 */
var collection_mm = null;
/*
 */
var collection_name = null;
/*
 */
function collection_onload(){

    var path = document.location.pathname.split('/');

    collection_yyyy = path[2];
    collection_mm = path[3];
    collection_name = path[4].split('.')[0];

    var collection = document.getElementById('collection');

    {
        var yyyy = document.createElement('li');

        yyyy.innerText = collection_yyyy

        collection.appendChild(yyyy);
    }
    {
        var mm = document.createElement('li');

        mm.innerText = collection_mm

        collection.appendChild(mm);
    }
    {
        var name = document.createElement('li');

        name.innerText = collection_name

        collection.appendChild(name);
    }
}
