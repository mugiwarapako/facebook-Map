"use strict";
const observableModule = require("data/observable");
const camera = require("nativescript-camera");
const imageSource = require("tns-core-modules/image-source");
const AnimationCurve = require("ui/enums").AnimationCurve;
const dialogs = require("ui/dialogs");
const SocketIO = require("nativescript-socket.io");
var config = require("../../../shared/config");


var pageData = new observableModule.fromObject({
    picture : "https://placehold.it/250x444"
});

var dragImageItem;
var prevDeltaX;
var prevDeltaY;
var isPhoto;
var base64;

var socketIO;

exports.pageLoaded = function(args) {

    var page = args.object;


    console.dir(config.Config.nodeUrl);

    dragImageItem = page.getViewById("dragImage");
    dragImageItem.translateX = 0;
    dragImageItem.translateY = 0;
    dragImageItem.scaleX = 1;
    dragImageItem.scaleY = 1
    isPhoto = false;

    socketIO = SocketIO.connect(config.Config.nodeUrl, {});

    page.bindingContext = pageData;

}


exports.onPan = function(args){
    console.log("Pana: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
    if (args.state === 1) {
        prevDeltaX = 0;
        prevDeltaY = 0;
    }
    else if (args.state === 2) {
        dragImageItem.translateX += args.deltaX - prevDeltaX;
        dragImageItem.translateY += args.deltaY - prevDeltaY;
        prevDeltaX = args.deltaX;
        prevDeltaY = args.deltaY;
    }
    else if (args.state === 3) // up
    {
      //Solamente si se muve más de 120px regresa la imagen a su posición inicial
      if (!(prevDeltaX < 120 && prevDeltaX > -120) || !(prevDeltaY < -50)) {
        dragImageItem.animate({
          translate: { x: 0, y: 0 },
          duration: 1000,
          curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        })
      } else if (prevDeltaY < -50) { //Si se hace hacia arriba más de 50px se envía
        dragImageItem.animate({
          translate: { x: 0, y: - 500 },
          duration: 1000,
          curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        }).then(() => {
            sendImage();

            // Reset animation
            setTimeout(() => {
                pageData.picture = "https://placehold.it/250x444";
                isPhoto = false;
                dragImageItem.translateX = 0;
                dragImageItem.translateY = 0;
            }, 500);
        });
      }
    }
}


exports.takePicture = function(){
    var options = { height: 100, keepAspectRatio: true, saveToGallery: false };
    camera.takePicture(options).
        then(function (imageAsset) {
        pageData.picture = imageAsset;
        isPhoto = true;
        var source = new imageSource.ImageSource();
        source.fromAsset(imageAsset).then(function (imageSource) {
            var added = imageSource.toBase64String("jpeg", 70);
            if (added) {
                base64 = added;

            }
        });
    }).catch(function (err) {
        console.log("Error -> " + err.message);
    });
}

 /** Envía la imagen a node.js */
 function sendImage() {

    console.log(isPhoto);
    if (isPhoto) {
      
      socketIO.emit('imageAdd',this.base64);
      base64 = null;
    }
    else{
      dialogs.alert({
        title: "Información",
        message:"Debe capturar una foto para enviarla",
        okButtonText: "Aceptar"
      }
      ).then(()=> {
        console.log("Dialog closed!");
    });
    }

  }