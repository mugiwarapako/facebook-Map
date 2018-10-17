'use strict';
const observableModule = require("data/observable");
const cameraModule = require("nativescript-camera");
const imageSourceModule	= require("image-source");
const dialogs = require("ui/dialogs");
const PhotoViewModel = require("../../../shared/fashion/photo-view-model/photo-view-model");


var page;
var photoView = new PhotoViewModel([]);

var pageData = new observableModule.fromObject({
    note : ""
});

exports.pageLoaded = function(args) {

    page = args.object;
    page.bindingContext = pageData;


}


exports.onRequestPermissionsTap = function(){
    // Validar si hay camara
	var isAvailable = cameraModule.isAvailable();

	console.log("isAvailable: " + isAvailable);

	// Opciones de la camara
	var options = { width: 150, height: 150, keepAspectRatio: true, saveToGallery: false };

	// VALIDAMOS SI HAY CAMARA O NO
	if (isAvailable) {
		// Solicitar permiso de camara
		cameraModule.requestPermissions();
		// Tomar Foto
		cameraModule.takePicture(options)
			.then(function (imageAsset) {

				// DESDE LA IMAGEN
					imageSourceModule.fromAsset(imageAsset).then(function (res) {
					// ASIGNAMOS EL BASE64 DE LA IMAGEN
					var image = page.getViewById("image");

					image.src = "data:image/png;base64,"+res.toBase64String("jpeg");

				});
			}).catch(function (err) {
				console.log("Error -> " + err.message);
			});
	}else {

        dialogs.alert({
            title: "Información",
            message:"Tu dispositivo no cuenta con camara",
            okButtonText: "Aceptar"
          }
          ).then(()=> {
            console.log("Dialog closed!");
        });
    };
    
}

exports.onSaveUser = function(){
    var image = page.getViewById("image");

    var userJson = { "imagen": image.src, "longitude": 0,"latitude" : 0, "status" : 1, "descripcion":pageData.note};

    photoView.add(userJson).then(function(){

        dialogs.alert({
            message: "Modelo correctamente guardado.",
            okButtonText: "Aceptar"
        });

    })
    .catch(function(){
        dialogs.alert({
            title: "Error",
            message: "Algo salio mal.",
            okButtonText: "Aceptar"
        });
    });

}