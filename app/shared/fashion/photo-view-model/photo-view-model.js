var config = require("../../config");
var ObservableArray = require("data/observable-array").ObservableArray;


function PhotoViewModel(items) {

    var viewModel = new ObservableArray(items);


    viewModel.add = function (photoData) {
        console.log("JSON ----*****---> " + JSON.stringify(photoData));
        console.log("apiUrl *****---> " + config.Config.apiUrl + "models/addModels");
        return fetch(config.Config.apiUrl + "models/addModels", {
            method: "POST",
            body: JSON.stringify({
                id_evento: 11,
                descripcion: photoData.description,
                imagen: photoData.imagen,
                latitud: photoData.latitude,
                statuxs: photoData.status,
                longitud: photoData.longitude,
                descripcion:photoData.descripcion
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
            });
    };


    viewModel.getList = function (photoData) {
        console.log("************" + photoData.id_evento);
        console.log("JSON -------> " + JSON.stringify(photoData));
        console.log("NOMBRE QUE LE MANDO DEL JS --------------->" +config.Config.apiUrl + "models/list" );
        return fetch(config.Config.apiUrl + "models/list", {
            method: "POST",
            body: JSON.stringify({
                id_evento: photoData.id_evento,
                status: photoData.status
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //console.dir(data);
                return data;
            });
    };


    return viewModel;

}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}


module.exports = PhotoViewModel;