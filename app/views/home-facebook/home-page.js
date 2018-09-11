"use strict";

var appSettings = require("tns-core-modules/application-settings");
var http = require("tns-core-modules/http");
var config = require("../../app.config").config;
var observableModule = require("data/observable");
var frameModule = require("ui/frame");
var nativeFace = require("nativescript-facebook");

var pageData = new observableModule.fromObject({
    username : "",
    userId : "",
    avatarUrl : ""
    
});

exports.pageLoaded = function(args) {
    var page = args.object;

    var accessToken = appSettings.getString("access_token");
        // Get logged in user's info
        http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/me?access_token=" + accessToken).then(function (res) {
            pageData.username = res.name;
            pageData.userId = res.id;

            console.log(config.FACEBOOK_GRAPH_API_URL + "/" + pageData.userId + "/picture?type=large&redirect=false&access_token=" + accessToken);
            http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/" + pageData.userId + "/picture?type=large&redirect=false&access_token=" + accessToken).then(function (res) {
                pageData.avatarUrl = res.data.url;
            }, function (err) {
                alert("Error getting user info: " + err);
            });
        }, function (err) {
            alert("Error getting user info: " + err);
        });


    page.bindingContext = pageData;

}

function _navigate (path) {
    var topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: path,
        clearHistory: true
    });
};

exports.onLogout = function () {
    appSettings.clear();
    _navigate("views/login/login");
}

exports.logout = function () {
    var _this = this;
    nativeFace.logout(function () {
        appSettings.clear();
        _navigate("views/login/login");
    });
}


exports.getCurrentAccessToken = function () {
    var accessToken = nativeFace.getCurrentAccessToken();
    alert("Current access token: " + JSON.stringify(accessToken, null, '\t'));
}