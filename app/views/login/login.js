"use strict";
var nativeFace = require("nativescript-facebook");
var appSettings = require("tns-core-modules/application-settings");

var frameModule = require("ui/frame");

exports.pageLoaded = function(args) {

    var page = args.object;

}

function _navigate (path) {
    var topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: path,
        clearHistory: true
    });
};

exports.login = function () {
    nativeFace.login(function (err, fbData) {
        if (err) {
            alert("Error during login: " + err.message);
        }
        else {
            appSettings.setString("access_token", fbData.token);
            _navigate("views/home-facebook/home-page");
        }
    });
};


exports.getCurrentAccessToken = function () {
    var accessToken = nativeFace.getCurrentAccessToken();
    alert("Current access token: " + JSON.stringify(accessToken, null, '\t'));
};

exports.onLogin = function (eventData) {
    if (eventData.error) {
        alert("Error during login: " + eventData.error.message);
    }
    else {
        appSettings.setString("access_token", eventData.loginResponse.token);
        _navigate("views/home-facebook/home-page");
    }
};