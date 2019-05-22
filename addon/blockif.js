"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome, document, location */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/**
 * @fileoverview send url to block if does not match whitelist
 */
function send() {
  chrome.runtime.sendMessage();
}

send();

// todo: on update settings: receive message, resend URL
