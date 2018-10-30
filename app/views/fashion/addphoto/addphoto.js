'use strict';
const observableModule = require("data/observable");
const cameraModule = require("nativescript-camera");
const imageSourceModule	= require("image-source");
const dialogs = require("ui/dialogs");
const PhotoViewModel = require("../../../shared/fashion/photo-view-model/photo-view-model");
const geolocation = require("nativescript-geolocation");
const  enumsUI = require("ui/enums");

var page;
var photoView = new PhotoViewModel([]);
var longitud;
var latitud;

var pageData = new observableModule.fromObject({
    note : ""
});

exports.pageLoaded = function(args) {

    page = args.object;
    location();
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

    console.log(longitud);
    console.log(latitud);

    var photoJson = { "imagen": image.src, "longitude": longitud, "latitude" : latitud, "status" : 1, "descripcion":pageData.note};

    console.log(photoJson);

    photoView.add(photoJson).then(function(){

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

function location(){
    var flagLocation = 0;
    if (!geolocation.isEnabled()) {
		// HABILITAR PERMISOS DE UBICACION
		geolocation.enableLocationRequest()
			.then(function() {
			
			flagLocation = 1;

			// OBTENEMOS UBICACION ACTUAL
			var location = geolocation.getCurrentLocation({ desiredAccuracy: enumsUI.Accuracy.high, updateDistance: 10, timeout: 10000 })
				.then(function (loc) {
				if (loc) {
					longitud = loc.longitude;
					latitud = loc.latitude;
				};									
			}, function(error) {
				longitud = 0;
				latitud = 0;
			});
		});
	} else {
		if(flagLocation == 0) {
			
			var location = geolocation.getCurrentLocation({ desiredAccuracy: enumsUI.Accuracy.high, updateDistance: 5, timeout: 5000 })
				.then(function (loc) {
				if (loc) {
					longitud = loc.longitude;
					latitud = loc.latitude;	
                };
			}, function (e) {
				console.log("Error location: " + e.message);
			});
		};
	};   
  }