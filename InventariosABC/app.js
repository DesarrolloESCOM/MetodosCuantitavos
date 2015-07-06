var app = angular.module('InventariosABC', []);
app.controller('InventariosController', function($scope) {
    $scope.lista= [];
    $scope.fila={};
    $scope.resultado = 0;
    $scope.sumaTotal = 0;
    $scope.valoresABC = {
    	A: 24,
    	B: 26,
    	C: 26
    }
    $scope.rangosABC = [
		{label:"A", color:"#696969", value:0},
		{label:"B", color:"#9ACD32", value:0},
		{label:"C", color:"#F0E68C", value:0}
	];
    //
    function calcularABC(){
    	$scope.sumaTotal = 0;
    	var contador = 0;
    	var contador2 = 0;
    	var lista = $scope.lista;
    	for(var i=0; i<lista.length; i++){
    		lista[i].consumoValoracion = lista[i].demandaAnual*lista[i].valorArticulo;
    		lista[i].porcentajeArticulo = 100/lista.length;
    		lista[i].porcentajeAcumulado = 0;
    		$scope.sumaTotal+= lista[i].consumoValoracion;
    	}
    	for(var i=0; i<lista.length; i++){
    		lista[i].porcentajeConsumoTotal = lista[i].consumoValoracion/$scope.sumaTotal*100;
    		//
    		contador += lista[i].porcentajeArticulo
    		lista[i].porcentajeAcumulado = contador;
    		//
    		contador2 += lista[i].porcentajeConsumoTotal;
			lista[i].porcentajeAcumuladoConsumo = contador2;
    	}
    	lista.sort(function sortClosure(a, b) { 
		    return b.consumoValoracion - a.consumoValoracion;
		});
		var contadorA = 0;
		var contadorB = 0;
		var contadorC = 0;
		for(var i=0; i<lista.length; i++){
    		if(lista[i].porcentajeAcumulado <= $scope.valoresABC.A){
    			lista[i].clase = 'A';
    			contadorA+=1;
    		}
    		if(lista[i].porcentajeAcumulado > $scope.valoresABC.A && lista[i].porcentajeAcumulado <= $scope.valoresABC.B){
    			lista[i].clase = 'B';
    			contadorB+=1;
    		}
    		if(lista[i].porcentajeAcumulado > $scope.valoresABC.B){
    			lista[i].clase = 'C';
    			contadorC+=1;
    		}
    	}
    	$scope.rangosABC[0].value = lista.length - contadorA;
    	$scope.rangosABC[1].value = lista.length - contadorB;
    	$scope.rangosABC[2].value = lista.length - contadorC;
    	$scope.lista = lista;
    };
    //
    function graficar(){
		var svg = d3.select("#grafica").append("svg").attr("width",300).attr("height",300);
		svg.append("g").attr("id","abcDonut");
		Donut3D.draw("abcDonut", $scope.rangosABC, 150, 150, 130, 100, 30, 0.4);
    };
    $scope.agregarFila = function agregarFila(fila){
		$scope.lista.push(fila);
		$scope.fila={};
		calcularABC();
		graficar();
    };

    $scope.eliminarFila = function eliminarFila(index){
		$scope.lista.splice(index, 1);
		calcularABC();
		graficar();
    };
});