/*
 * https://www.syntelos.io/recent.js
 * Copyright 2022 John Pritchard (@syntelos)
 * CC-BY-NC https://creativecommons.org/licenses/by-nc/4.0/
 */

/*
 * Global: visibile page object from directory.
 */
var recent_current = null;

/*
 * Global: array of objects established by
 * "recent.json" and enhanced with element "div" from
 * document.
 */
var recent_directory = null;

/*
 * Initialization
 */
function recent_initialize(){

    if (null != recent_directory){

        for (index in recent_directory){

            pg = recent_directory[index];

            div = document.getElementById(pg.id);

            if (null != div){

                if (null != recent_current && div != recent_current){

                    recent_current.visibility = 'hidden';
                }

                recent_current = pg;

                div.style.visibility = 'visible';

                div.style.zIndex = 2;

            }
            else {
                div = document.createElement("div");

                div.id = pg.id;
                div.className = 'page text';
                div.style.visibility = 'hidden';

                div.style.zIndex = 2;

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

        setTimeout(recent_next,3000);
    }
}

/*
 * Navigation onclick
 */
function recent_next (){

    if (null != recent_current){

        next = false;

        for (index in recent_directory){

            pg = recent_directory[index];

            if (pg == recent_current){

                div = document.getElementById(pg.id);

                div.style.visibility = 'hidden';

                next = true;
            }
            else if (next){

                div = document.getElementById(pg.id);

                if (null != div){

                    recent_current = pg;

                    div.style.visibility = 'visible';

                    next = false;

                    break;
                }
            }
        }

        if (next){

            for (index in recent_directory){

                pg = recent_directory[index];

                if (pg != recent_current){

                    div = document.getElementById(pg.id);

                    if (null != div){

                        recent_current = pg;

                        div.style.visibility = 'visible';

                        next = false;

                        break;
                    }
                }
            }
        }

        setTimeout(recent_next,20000);
    }
}

/*
 * Initialization requires 'recent.json'.
 */
{
    var init_loader = new XMLHttpRequest();

    init_loader.open("GET","/recent.json",true);

    init_loader.onload = function (e) {

        if (200 == init_loader.status && null != init_loader.responseText){

            recent_directory = JSON.parse(init_loader.responseText);

            recent_initialize();
        }
    };
    init_loader.send(null);
}
