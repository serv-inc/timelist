"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals location */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/**
* @fileoverview block if does not match whitelist
 */
let whitelist = RegExp("google.*newtab|google.*source[^\/]*url|");

chrome.storage.managed.get("whitelist", function(result) {
    if ( "whitelist" in result ) {
        whitelist = RegExp(result.whitelist);
        check();
    } else {
        chrome.storage.local.get("whitelist", function(result) {
            if ( "whitelist" in result ) {
                whitelist = RegExp(result.whitelist);
            }
            check();
        });
    }
});


function check() {
    if ( ! whitelist.test(location.href) ) {
        location.href = chrome.extension.getURL("blocked.html");
    }
}
