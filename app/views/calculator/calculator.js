'use strict'
const observableModule = require("data/observable");
const textFieldModule = require("tns-core-modules/ui/text-field");
const Label = require("tns-core-modules/ui/label").Label;
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout").GridLayout;
const Button = require("tns-core-modules/ui/button").Button;



var page;

var pageData = new observableModule.fromObject({
    level : 15,
    getColOp : ""
});

var operaciones = {
    1 : "+",
    2 : "-",
    3 : "*"
}


var colTotal;
var numMin;
var numMax;
var lista = Array();

exports.pageLoaded = function(args) {

    page = args.object;
    crearOperacion();
    page.bindingContext = pageData;

}

function crearOperacion(){

    /* Se obtiene el grid principal */
    var gridPrincipal = page.getViewById("principal");
    /* se selecciona al azar una operación */
    var numeroOperacion = Math.floor(Math.random() * (4 - 1)) + 1;
    //var numeroOperacion = 3;
    /* Se elimina todo el contenido del grid principal*/
    gridPrincipal.removeChildren();


    /* Se optiene el numero maximo y el minimo para la operacion */
    _obtenerRango();

    _obtenerNumeros(numeroOperacion);

    /* Se obtiene para el grid el total de columnas (*,*,*) */
    pageData.getColOp = _addValueColGrid(numeroOperacion);

    gridPrincipal = _agregarEtiquetas(gridPrincipal, numeroOperacion);

    gridPrincipal = _agregarGridContenido(gridPrincipal, numeroOperacion);
    

}

function _agregarEtiquetas(grid, numeroOperacion){

    var gridLayout = grid;

    /* Se Crean las etiquetas */
    var titulo = _crearLabel("Calculadora",0,0);
    titulo.colSpan = 3;
    var simbolo = _crearLabel(operaciones[numeroOperacion],0,2);
    simbolo.rowSpan = 2;
    var igual = _crearLabel("__________________",1,3);

    gridLayout.addChild(titulo);
    gridLayout.addChild(simbolo);
    gridLayout.addChild(igual);

    return gridLayout;
}

function _agregarGridContenido(grid, numeroOperacion){
    /* Se crea grid's para la operacion */
    var gridPrimero = _crearGrid("1","1");
    var gridSegundo = _crearGrid("2","1");
    var gridTotal = _crearGrid("4","1");
    
    var botonCalular;

     /* A los grid se le agregan los numeros que anteriormente se generaron*/
     gridPrimero = _agregarEtiquetasGrid(gridPrimero, pageData.get("numero1"));
     gridSegundo = _agregarEtiquetasGrid(gridSegundo, pageData.get("numero2"));

    if(pageData.get("numero2") > 9){
        if(numeroOperacion == 3){
            gridTotal.rows = "*,*,*,*"; 
            gridTotal.rowSpan = 4;
            botonCalular = _crearBoton("Calcular", 9, 1);
        }else{
    
            botonCalular = _crearBoton("Calcular", 6, 1);
    
        }
    }else{
        botonCalular = _crearBoton("Calcular", 6, 1);
    }

     gridTotal = _agregarTextos(gridTotal, numeroOperacion, 0);
     
     

    /* Se modifica el boton */
    botonCalular.on("tap", (args) => {
        

        var numeroRespuesta = "";

        lista.forEach(element => {
            numeroRespuesta+=element;
        });

        console.log(numeroRespuesta);

        switch(numeroOperacion){
            case 1:
            if(parseInt(numeroRespuesta) === parseInt(pageData.get("numero1") + pageData.get("numero2"))){

                alert("si");
    
            }else{
                alert("no");
            }
            break;

            case 2:
            if(parseInt(numeroRespuesta) === parseInt(pageData.get("numero1") - pageData.get("numero2"))){

                alert("si");
    
            }else{
                alert("no");
            }
            break;

            case 3:
            if(parseInt(numeroRespuesta) === parseInt(pageData.get("numero1") * pageData.get("numero2"))){

                alert("si");
    
            }else{
                alert("no");
            }
            break;
        }


        crearOperacion();
    });


    /* Se agrega el grid principal */

    grid.addChild(gridPrimero);
    grid.addChild(gridSegundo);
    grid.addChild(gridTotal);
    grid.addChild(botonCalular);
    return grid;
}

function _agregarEtiquetasGrid(grid, numero){

    var gridLayout = grid;

    var cadeSifra = numero.toString().split("");
    var lugar = 0 ;
    
    for(var i = cadeSifra.length - 1; i >=  0; i--){

        if(cadeSifra[i] === undefined){
            gridLayout.addChild(_crearLabel(0, ((colTotal - 1) - lugar), 0));
        }else{
            gridLayout.addChild(_crearLabel(cadeSifra[i],((colTotal - 1) -lugar), 0));
        }

        lugar ++;
    }

    return gridLayout;
}

function _agregarTextos(grid, numeroOperacion, fila){

    var gridLayout = grid;
    if(numeroOperacion == 3){

        var cadeSifra = pageData.get("numero2").toString().split("");

        if(pageData.get("numero2") > 9){

            var igual = _crearLabel("___________________",0,2);
            igual.colSpan=colTotal;

            var signo = _crearLabel("+",0,1);
            igual.rowSpan=2;
        
            gridLayout.addChild(igual);
            gridLayout.addChild(signo);

        }
        for(var i = cadeSifra.length - 1; i >= 0 ; i--){


            for(var j = colTotal; j > 0; j--){  
            
                
                
                gridLayout.addChild(
                    _crearTexto(j,i)
                );
            }

        }
    
        

        
    }else{
        for(var i = colTotal; i >= 0; i--){  
            
            var texto = _crearTexto(i,fila);

            texto.on("textChange", function(num){

                _agregarLista(num.object);   
            });

            gridLayout.addChild(texto);

        }
    }

    for(var j = colTotal; j >= 0; j--){  
        
        var texto = _crearTexto(j,3);

        texto.on("textChange", function(num){

            _agregarLista(num.object);   
            
        });

        gridLayout.addChild(texto);
    }

    return gridLayout;
}

/* Metodo para crear una etiqueta */
function _crearLabel(texto, columna, fila){
    const newLabel = new Label();
    newLabel.text =  texto;
    newLabel.className = "number";
    newLabel.col = columna;
    newLabel.row = fila;

    return newLabel;
}

/* Metodo para crear un gridLayout */
function _crearGrid(fila, columna){

    const newGridLayout = new GridLayout();
    newGridLayout.columns = pageData.getColOp; 
    newGridLayout.rows="60";
    newGridLayout.width="100%";
    newGridLayout.height="100%";
    newGridLayout.row=fila;
    newGridLayout.col=columna;

    return newGridLayout;
}


function _crearTexto(num, fila){
    const textField = new textFieldModule.TextField();
    textField.text = "";
    textField.className = "input input-border number-calculator";
    textField.col =  num;
    textField.row =  fila;
    textField.maxLength = "1";
    textField.keyboardType = "number";

    return textField;
}


function _crearBoton(text, fila, columna){

    const newButton = new Button();
    newButton.text = text;
    newButton.className = "btn btn-primary btn-active";
    newButton.width = "100%";
    newButton.height = "100%";
    newButton.row = fila;
    newButton.col = columna;

    return newButton;

}


function _obtenerRango(){
    var nivel = pageData.level;

    if(nivel <= 10){
        numMin = 1;    
        numMax = 10;

    }else{
        numMin = 10; 
        numMax = 100;
    }

}

function _addValueColGrid(numeroOperacion){

    var num = 0;
    switch(numeroOperacion){

        case 1:
        num = (pageData.get("numero1") + pageData.get("numero2")).toString().length;
        break;

        case 2:
        num = (pageData.get("numero1")).toString().length;
        break;

        case 3:
        if(pageData.get("numero2") > 9){
            num = (pageData.get("numero1") * pageData.get("numero2")).toString().length + 1;
        }else{
            num = (pageData.get("numero1") * pageData.get("numero2")).toString().length;
        }
        
        break;

    }

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


function _agregarLista(object){
    console.log("******************" + object.col);
    console.log("******************" + object.text);

    lista[object.col] = object.text;
}


exports.calcular = function () {
    
    var total = '';

    for(var i = 0; i < colTotal; i++){
        total += (pageData.get("text"+(i+1)))+'';
    }

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

function _obtenerNumeros(numeroOperacion){

    var numero1 = 0;
    var numero2 = 0;

    /* Se agregan las variables a pageData para la vista */
    if(numeroOperacion == 2){
        do{
            numero1 = Math.floor(Math.random() * (numMax - numMin)) + numMin;
            numero2 = Math.floor(Math.random() * (numMax - numMin)) + numMin;
        }while(numero1 < numero2);

        pageData.set("numero1" , numero1);
        pageData.set("numero2" , numero2);
    }else{
        numero1 = Math.floor(Math.random() * (numMax - numMin)) + numMin;
        numero2 = Math.floor(Math.random() * (numMax - numMin)) + numMin;
        pageData.set("numero1" , numero1);
        pageData.set("numero2" , numero2);
    }
}