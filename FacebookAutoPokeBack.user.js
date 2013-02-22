// ==UserScript==
// @name        FacebookAutoPokeBack
// @namespace   ravij
// @include     https://.*.facebook.com/pokes*
// @include     http://.*.facebook.com/pokes*
// @version     1.0
// @author      Ravi Joshi
// ==/UserScript==

body = document.body;
if (body != null) {
    div = document.createElement("div");
    div.style.display = "block";
	div.style.width = "300px";
	div.style.position = "absolute";
	div.style.top = "10%";
	div.style.left = "30%";
    div.style.backgroundColor = "#E7EBF2";
    div.style.border = "1px solid #6B84B4";
    div.style.padding = "3px";
    div.innerHTML = "<center style='font-weight:bold;color:#3B5998'>Facebook Auto Pokeback is successfully installed</center>"
    body.appendChild(div);
}

var userId;
var fb_dtsg;

var startsWith = function (string, prefix) {
    return string.indexOf(prefix) == 0;
};

var endsWith = function (string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) != -1;
};

var elements = document.getElementsByTagName('a');
var uIds = new Array();

for (var j = 0; j < elements.length; j++) {
    var ajaxify = elements[j].getAttribute('ajaxify');

    if (ajaxify) {
        var str = elements[j].innerHTML;
        if (endsWith(str, 'Poke Back')) {
            var myuid = ajaxify.match(/uid=([0-9]+)/)[1];
            uIds.push(myuid);
        } else if (startsWith(str, 'Show Older')) {
            var splits = ajaxify.match(/user=([0-9]+)/);
            if (splits) {
                userId = splits[1];
            }
        }
    }
}

var param = document.getElementsByTagName('input');
for (var j = 0; j < param.length; j++) {
    if (param[j].hasAttribute('name') && param[j].getAttribute('name') == 'fb_dtsg') {
        fb_dtsg = param[j].getAttribute('value');
    }
}

var i = 0; //  set counter to 0

function poke() { //  create a loop function
    setTimeout(function () { //  call a 100ms setTimeout when the loop is called

        var uid = uIds[i];
        var http = new XMLHttpRequest();
        var args = 'uid=' + uid + '&pokeback=1&nctr[_mod]=pagelet_pokes&__user=' + userId + '&__a=1&fb_dtsg=' + fb_dtsg;
        http.open('POST', '/ajax/pokes/poke_inline.php', true);

        http.onreadystatechange = function () {
            if (http.readyState != 4) return;
            if (http.status == 200) {
                console.log(http.responseText);
            } else {
                console.log('request error');
            }
        };

        http.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
        http.setRequestHeader('Cache-Control', 'no-cache');
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        http.setRequestHeader('Content-length', args.length);
        http.send(args);

        i++; //  increment the counter
        if (i < uIds.length) {
            poke(); //  ..  again which will trigger another 
        } //  ..  setTimeout()
    }, 5000) // put a delay of 5 seconds in each request
}

poke(); //  start the loop