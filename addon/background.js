"use strict";
/* jshint esversion: 6, strict: global */
/* jshint laxbreak: true */
/* globals chrome */
/* globals getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

let _cache;
// todo: comment this function out
function whitelistRegExp() {
  if ( ! _cache ) {
    _cache = RegExp(getSettings().whitelist +"|^((chrome|moz)(|-extension)):\\/");
  }
  return _cache;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ( "url" in changeInfo ) {
    checkTab(tab);
  }
});

getSettings().addOnChangedListener("whitelist", () => {
  _cache = null;
  chrome.tabs.query(null, (tab) => {
    checkTab(tab);
  });
});

function checkTab(tab) {
  if ( ! whitelistRegExp().test(tab.url) ) {
    setBlockPage(tab.id, tab.url);
  }
}
                                   
//some codup jsguardian
function setBlockPage(tabId, blockedUrl) {
  chrome.tabs.update(tabId,
		     {'url': chrome.extension.getURL('blockpage.html')
                      + '?' + encodeURIComponent(blockedUrl)});
}
