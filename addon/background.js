"use strict";
/* jshint esversion: 6, strict: global */
/* jshint laxbreak: true */
/* globals chrome */
/* globals getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ( "url" in changeInfo ) {
    checkTab(tab);
//    if ( ! getSettings().whitelistRegExp.test(changeInfo.url) ) {    
//      setBlockPage(tabId, changeInfo.url);
//    }
  }
});

getSettings().addOnChangedListener("whitelist", () => {
  chrome.tabs.query(null, (tab) => {
    checkTab(tab);
  });
});

function checkTab(tab) {
  if ( ! getSettings().whitelistRegExp.test(tab.url) ) {    
    setBlockPage(tab.id, tab.url);
  }
};
                                   
//some codup jsguardian
function setBlockPage(tabId, blockedUrl) {
  chrome.tabs.update(tabId,
		     {'url': chrome.extension.getURL('blockpage.html')
                      + '?' + encodeURIComponent(blockedUrl)});
}
