"use strict";
/* jshint esversion: 6, strict: global */
/* globals document */
// licensed under the MPL 2.0 by (github.com/serv-inc)

var params = decodeURIComponent(document.location.search.slice(1)).split('&');
// page
document.querySelector("#page").innerText = params[0];
// block set
if (params[1] !== "-1") {
  document.querySelector("#blockset").innerText = params[1];
}
