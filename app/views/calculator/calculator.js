'use strict'
const observableModule = require("data/observable");
const textFieldModule = require("tns-core-modules/ui/text-field");
const labelModule = require("tns-core-modules/ui/label");

var page;

var pageData = new observableModule.fromObject({
    level : 1,
    getColOp : ""
});

var colTotal;

exports.pageLoaded = function(args) {

    page = args.object;

    _llenarOperacion();

    page.bindingContext = pageData;

}




function _llenarOperacion(){
    
    var nivel = pageData.level;
    console.log("Nivel que estas --> "+nivel);
    var max;
    var min = 1;

    if(nivel <= 10){
        
        max = 10;

    }else{
        max = 100;
    }

    var numero1 = Math.floor(Math.random() * (max - min)) + min;
    var numero2 = Math.floor(Math.random() * (max - min)) + min;

    pageData.getColOp = _addValueGrid((numero1 + numero2).toString().length );

    var gridLayoutop1 = page.getViewById("operaciones1");
    var gridLayoutop2 = page.getViewById("operaciones2")

    gridLayoutop1.removeChildren();
    gridLayoutop2.removeChildren();

   _addNumbers(numero1, gridLayoutop1);
   _addNumbers(numero2, gridLayoutop2);

   pageData.set("numero1" , numero1);
   pageData.set("numero2" , numero2);

   _camposNuevos();

}

function _addValueGrid(num){

    colTotal = num;
    var respuesta = "";

    for(var i = 0; i < num; i++){
        if(i == (num-1)){
            respuesta += "*";
        }else{
            respuesta += "*,";
        }
    }

    return (respuesta);
    
}

function _addNumbers(number, grid){
    
    var gridLayout = grid;
    var cadeSifra = number.toString().split("");

    for(var i = colTotal; i > 0; i--){

        const myLabel = new labelModule.Label();
        myLabel.text =  cadeSifra.length ? cadeSifra.pop() : '';
        myLabel.className = "number";
        myLabel.col = i - 1;

        gridLayout.addChild(myLabel);
    }
}


function _camposNuevos(){

    var gridLayout = page.getViewById("campos");
    gridLayout.removeChildren();

    for(var i = colTotal; i > 0; i--){

        const textField = new textFieldModule.TextField();

        textField.id = "text"+i;
        textField.text = "";
        textField.className = "input input-border number-calculator";
        textField.col =  i - 1;
        textField.maxLength = "1";
        textField.keyboardType = "number";

        textField.on("textChange", function(num){

            pageData.set(num.object.id, num.object.text);
            
        });
        
        gridLayout.addChild(textField);    
    }
}




exports.calcular = function () {
    
    var total = '';

    for(var i = 0; i < colTotal; i++){
        total += (pageData.get("text"+(i+1)))+'';
    }

    
    console.log("Total colocado por el usuario ---> " + parseInt(total));
    console.log("Total de la suma ------> " + (pageData.get("numero1") + pageData.get("numero2")));

    if(parseInt(total) == (pageData.get("numero1") + pageData.get("numero2"))){
        alert("Correcto");
        pageData.level = pageData.level + 1;
       _llenarOperacion(); 
    }else{
        alert("Error");
        pageData.level = pageData.level - 1;
        _llenarOperacion();
    }

}

function _addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}