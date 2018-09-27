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
        clearHistory: false
    });
};

exports.facebook = function () {
    _navigate("views/login/login");
};

exports.mapa = function () {
    _navigate("views/map/map");
};

exports.calculator = function(){
    _navigate("views/calculator/calculator");
};