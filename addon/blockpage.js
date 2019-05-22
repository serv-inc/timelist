"use strict";
/* jshint esversion: 6, strict: global */
/* globals document, URLSearchParams, window */
// licensed under the MPL 2.0 by (github.com/serv-inc)

let params = new URLSearchParams(window.location.search);
// page
document.querySelector("#page").innerText = params.get("page");
// block set
if (params.has("index")) {
  document.querySelector("#blockset").innerText = params.get("index");
}
