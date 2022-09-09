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

    var loader = new XMLHttpRequest();

    loader.open("GET","/collections/"+collection_name+".txt",false);
    loader.onload = function (e){

        if (4 == loader.readyState && 200 == loader.status &&
            null != loader.responseText)
        {
            var index_txt = loader.responseText;
            var index_ary = index_txt.split('\n');
            var index_cnt = index_ary.length;
            var index;
            for (index = 0; index < index_cnt; index++){

                var index_record = index_ary[index].split('\t');

                    try {
                        var tweet_id = new URL(index_record[0]);
                        var tweet_url = new URL(index_record[1]);

                        var tweet_path = tweet_url.pathname.split('/');
                        var tweet_poster = tweet_path[1];
                        var tweet_id = tweet_path[3];

                        var twel_li = document.createElement('li');
                        {
                            twel_li.id = (tweet_poster+'-'+tweet_id);

                            collection.appendChild(twel_li);
                        }


                    }
                    catch (x){
                        console.error(x);
                    }
                }
            }
        }
    };
    loader.send();
}
