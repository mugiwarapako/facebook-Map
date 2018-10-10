'use strict';
const observableModule = require("data/observable");
const textFieldModule = require("tns-core-modules/ui/text-field");
const Label = require("tns-core-modules/ui/label").Label;
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout").GridLayout;
const Button = require("tns-core-modules/ui/button").Button;

var page;
var numMin;
var numMax;
var colTotal;
var lista = Array();

var pageData = new observableModule.fromObject({
    level : 11
});

exports.pageLoaded = function(args) {

    page = args.object;
    _crearResta();
    page.bindingContext = pageData;


}



function _crearResta(){

    var gridPrincipal = page.getViewById("principal");

    gridPrincipal.removeChildren();

    _obtenerRango();

    _obtenerNumeros();

    pageData.getColOp = _addValueColGrid();

    gridPrincipal = _agregarEtiquetas(gridPrincipal);

    gridPrincipal = _agregarGridContenido(gridPrincipal);
    
}


function _obtenerRango(){
    var nivel = pageData.level;

    if(nivel <= 10){
        numMin = 1;    
        numMax = 10;

    }else{
        numMin = 100; 
        numMax = 100000;
    }

}

function _obtenerNumeros(){

    var numero1;
    var numero2;

    do{
        numero1 = Math.floor(Math.random() * (numMax - numMin)) + numMin;
        numero2 = Math.floor(Math.random() * (numMax - numMin)) + numMin;

    }while(numero1 < numero2);

    pageData.set("numero1" , numero1);
    pageData.set("numero2" , numero2);
}



function _addValueColGrid(){

    var num = pageData.get("numero1").toString().length;

    colTotal = num;
    
    return _obtenerStringGrid(num);
    
}



function _obtenerStringGrid(num){
    
    var respuesta = "";

    for(var i = num; i > 0; i--){
        if(i == 1){
            respuesta += "*";
        }else{
            respuesta += "*,";
        }
    }
    return (respuesta);
}


function _agregarEtiquetas(grid){

    var gridLayout = grid;

    /* Se Crean las etiquetas */
    var simbolo = _crearLabel("+",0,1);
    simbolo.row = 1;
    var igual = _crearLabel("",1,3);
    igual.row = 2;
    igual.className = "border";

    gridLayout.addChild(simbolo);
    gridLayout.addChild(igual);

    return gridLayout;
}

function _crearLabel(texto, columna, fila){
    const newLabel = new Label();
    newLabel.text =  texto;
    newLabel.className = "number-calculator";
    newLabel.col = columna;

    return newLabel;
}


function _agregarGridContenido(grid){
    /* Se crea grid's para la operacion */
    var gridPrimero = _crearGrid("0","1");
    var gridSegundo = _crearGrid("1","1");
    var gridTotal = _crearGrid("3","1");
    
    var botonCalular = _crearBoton("Calcular", 4, 1);

    /* A los grid se le agregan los numeros que anteriormente se generaron*/
    gridPrimero = _agregarEtiquetasGrid(gridPrimero, pageData.get("numero1"));
    gridSegundo = _agregarEtiquetasGrid(gridSegundo, pageData.get("numero2"));


    gridTotal = _agregarTextos(gridTotal, 0);
     
     

    /* Se modifica el boton */
    botonCalular.on("tap", (args) => {
        

        var numeroRespuesta = "";

        lista.forEach(element => {
            numeroRespuesta+=element;
        });

        if(parseInt(numeroRespuesta) === parseInt(pageData.get("numero1") - pageData.get("numero2"))){

            alert("si");

        }else{
            alert("no");
        }

        _crearResta();

    });


    /* Se agrega el grid principal */

    grid.addChild(gridPrimero);
    grid.addChild(gridSegundo);
    grid.addChild(gridTotal);
    grid.addChild(botonCalular);
    return grid;
}


function _agregarTextos(grid, fila){

    var gridLayout = grid;
    
    for(var i = colTotal; i >= 0; i--){  

        gridLayout.addChild(_crearTexto(i,fila));

    }

    return gridLayout;
}


function _crearTexto(num, fila){
    const textField = new textFieldModule.TextField();
    textField.text = "";
    textField.className = "number-calculator";
    textField.col =  num;
    textField.row =  fila;
    textField.maxLength = "1";
    textField.keyboardType = "number";

    textField.on("textChange", function(num){

        _agregarLista(num.object);   
    });

    return textField;
}


function _agregarLista(object){

    lista[object.col] = object.text;
}


function _agregarEtiquetasGrid(grid, numero){

    var gridLayout = grid;
    var cadeSifra = numero.toString().split("");
    var lugar = cadeSifra.length;

    cadeSifra.forEach((element) => {
        gridLayout.addChild(_crearLabel(element, (colTotal - lugar), 0));
        lugar --;
    });


    return gridLayout;
}

/* Metodo para crear un gridLayout */
function _crearGrid(fila, columna){

    const newGridLayout = new GridLayout();
    newGridLayout.columns = pageData.getColOp; 
    newGridLayout.row=fila;
    newGridLayout.col=columna;

    return newGridLayout;
}

function _crearBoton(text, fila, columna){

    const newButton = new Button();
    newButton.text = text;
    newButton.className = "btn btn-primary btn-active";

    newButton.row = fila;
    newButton.col = columna;

    return newButton;

}