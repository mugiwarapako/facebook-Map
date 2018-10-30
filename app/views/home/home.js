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



exports.suma = function(){
    _navigate("views/calculator/suma/suma");
};


exports.resta = function(){
    _navigate("views/calculator/resta/resta");
};


exports.multiplicacion = function(){
    _navigate("views/calculator/multiplicacion/multiplicacion");
};

exports.photo = function(){
    _navigate("views/fashion/photo/photo");
};

exports.addphoto = function(){
    _navigate("views/fashion/addphoto/addphoto");
};

exports.gallery = function(){
    _navigate("views/fashion/gallery/gallery");  
}

exports.ratephoto = function(){
    _navigate("views/fashion/rate-photo/rate-photo");  
}