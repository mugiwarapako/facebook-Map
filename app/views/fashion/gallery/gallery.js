'use strict';
const observableModule = require("data/observable");
const dialogs = require("ui/dialogs");
const PhotoViewModel = require("../../../shared/fashion/photo-view-model/photo-view-model");
var ObservableArray = require("data/observable-array").ObservableArray;

var page;
var photoView = new PhotoViewModel([]);

var pageData = new observableModule.fromObject({
    note : "",
    listModels : new ObservableArray()
});

exports.pageLoaded = function(args) {

    page = args.object;
    pageData.listModels = list();

    var activityIndicator = page.getViewById("activityIndicator");
    activityIndicator.busy = true;

  
    page.bindingContext = pageData;


}

function list(){

    var array = new ObservableArray();
    var photoJson = {"id_evento": 11, status:1};
    var activityIndicator = page.getViewById("activityIndicator");

	photoView.getList(photoJson).then(function (data) {
        
        array.push(data.response);
        activityIndicator.busy = false;
        
    }).catch(function (error) {
        activityIndicator.busy = false;
        console.log(error);
        dialogsModule.alert({
            message: "No pude procesar la petición.",
            okButtonText: "OK"
        });
        return Promise.reject();
    });

    return array;

}
