'use strict';
const observableModule = require("data/observable");
var config = require("../../../shared/config");
const enums = require("ui/enums");
const Image = require("image-source");
const SocketIO = require("nativescript-socket.io");

var page;
var socketIO;

var pageData = new observableModule.fromObject({
    picture : "https://placehold.it/250x444"
});

exports.pageLoaded = function(args) {

    page = args.object;
    
    console.log("ya!!!!!");

    socketIO = SocketIO.connect(config.Config.nodeUrl, {});

    comienzo();

    page.bindingContext = pageData;


}


function comienzo(){

    var dragImageItem = page.getViewById("dragImage");

    socketIO.on("recivedImage", data => {
        pageData.picture = Image.fromBase64(data); 
        //console.log(data);
        dragImageItem.translateY = -500;
        pageData.picture = Image.fromBase64(data); 
        dragImageItem.animate({
          translate: { x: 0, y: 0 },
          duration: 1000,
          curve: enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        }).then(() => {


        });
    });
}
