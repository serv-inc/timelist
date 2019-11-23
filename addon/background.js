"use strict";
/* jshint esversion: 6, strict: global, laxbreak: true */
/* globals chrome, getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/** main: listens to browsing */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if ( "url" in changeInfo ) {
        checkTab(tab);
    }
});

let _blockCache;


/** @return regexp from element, with default pages allowed */
function _buildRegExp(element) {
    return RegExp(element +"|^(about|chrome|moz)(|-extension):", "i");
}

/** @return Date from "HHMM" time string */
function _initTime(timestring) {
    const out = new Date();
    out.setHours(timestring.slice(0, 2));
    out.setMinutes(timestring.slice(2, 4));
    return out;
}

/** short-lived block **/
class TimeBlock {
    constructor(checks, start, end, blacklist) {
        this._checker = _buildRegExp(checks);
        this._starttime = _initTime(start);
        this._endtime = _initTime(end);
        this._blacklist = RegExp(blacklist, "i");
    }

    /** @return true iff outside of time or URL ok as of whitelist */
    is_ok(url) {
        return ( new Date() < this._starttime ||
             new Date() > this._endtime ||
             this._checker.test(url)
        );
    }
}

/** checks tab if defined blocks allow its url */
function checkTab(tab) {
    if ( tab.url === undefined ) {
        return;
    }
    blocks().forEach((block, index) => {
        if ( ! block.is_ok(tab.url) ) {
            setBlockPage(tab.id, tab.url, index);
        }
    });
}



// some codup jsguardian and ytb (params)
function setBlockPage(tabId, blockedUrl, index) {
    const params = new URLSearchParams();
    params.append("page", blockedUrl);
    params.append("index", index);
    chrome.tabs.update(
        tabId,
        {"url": chrome.extension.getURL("blockpage.html") +
        "?" + params.toString()}
    );
}

/** initializes and returns TimeBlock array */
function blocks() {
    if ( ! _blockCache ) {
        _blockCache = [];
        if ( typeof getSettings().blocks !== "undefined" ) {
            getSettings().blocks.forEach((el) => {
              _blockCache.push(new TimeBlock(
                el.whitelist,
                el.starttime,
                el.endtime,
                el.blacklist || "(?!x)x"));  // default: blacklist allows all
            });
        }
    }
    return _blockCache;
}

