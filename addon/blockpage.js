"use strict";
// licensed under the MPL 2.0 by (github.com/serv-inc)

const params = new URLSearchParams(window.location.search);
// page
document.querySelector("#page").innerText = params.get("page");
// block set
if (params.has("index")) {
    document.querySelector("#blockset").innerText = params.get("index");
}
