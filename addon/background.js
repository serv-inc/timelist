"use strict";
/* jshint esversion: 6, strict: global */
/* jshint laxbreak: true */
/* globals chrome */
/* globals getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

// optimize: check listen to onchange, replace whitelistRegExp &c
let _blockCache;

/** @return regexp from element, with default pages allowed */
function _buildRegExp(element) {
  return RegExp(element +"|^(chrome|moz)(|-extension):", "i");
}


/** @return Date from "HHMM" time string */
function _initTime(timestring) {
  var out = new Date();
  out.setHours(timestring.slice(0, 2));
  out.setMinutes(timestring.slice(2, 4));
  return out;
}


/** short-lived block **/
class TimeBlock {
  constructor(checks, start, end) {
    this._checker = _buildRegExp(checks);
    this._starttime = _initTime(start);
    this._endtime = _initTime(end);
  }


  // todo: unit test this
  /** @return true iff outside of time or URL ok as of whitelist */
  is_ok(url) {
    return ( new Date() < this._starttime
             || new Date() > this._endtime
             || this._checker.test(url)
           );
  }
}


function checkTab(tab) {
  if ( ! whitelistRegExp().test(tab.url) ) {
    setBlockPage(tab.id, tab.url, -1);
  }
  blocks().forEach((block, index) => {
    if ( ! block.is_ok(tab.url) ) {
      setBlockPage(tab.id, tab.url, index);
    }
  });
}


//some codup jsguardian
function setBlockPage(tabId, blockedUrl, index) {
  chrome.tabs.update(tabId,
		     {'url': chrome.extension.getURL('blockpage.html')
                      + '?' + encodeURIComponent(blockedUrl)
                      + '&' + index});
}


function whitelistRegExp() {
  return _buildRegExp(getSettings().whitelist);
}


function blocks() {
  if ( ! _blockCache ) {
    _blockCache = [];
    if ( typeof getSettings().blocks !== "undefined" ) {
      getSettings().blocks.forEach((el) => {
        _blockCache.push(new TimeBlock(el.whitelist, el.starttime, el.endtime));
      });
    }
  }
  return _blockCache;
}

// ======= LISTENERS ============
/** main: listens to browsing */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ( "url" in changeInfo ) {
    checkTab(tab);
  }
});
/** main: listens to settings change */
getSettings().addOnChangedListener("whitelist", () => {
  chrome.tabs.query({}, (tab) => {
    checkTab(tab);
  });
});
getSettings().addOnChangedListener("blocks", () => {
  _blockCache = null;
  chrome.tabs.query({}, (tab) => {
    checkTab(tab);
  });
});
