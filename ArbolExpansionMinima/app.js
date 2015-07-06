function kruskal(nodes, edges) {
    var mst = [];
    var forest = _.map(nodes, function(node) { return [node]; });
    var sortedEdges = _.sortBy(edges, function(edge) { return -edge[2]; });
    while(forest.length > 1) {
        var edge = sortedEdges.pop();
        var n1 = edge[0],
        n2 = edge[1];

        var t1 = _.filter(forest, function(tree) {
            return _.include(tree, n1);
        });
            
        var t2 = _.filter(forest, function(tree) {
            return _.include(tree, n2);
        });
        if (t1 != t2) {
            forest = _.without(forest, t1[0], t2[0]);
            forest.push(_.union(t1[0], t2[0]));
            mst.push(edge);
        }
    }
    return mst;
}

function graficar(nodes, edges, solvedEdges){
    document.getElementById('graph-container-original').innerHTML="";
    document.getElementById('graph-container-solved').innerHTML="";
    var i,
    s,
    s2,
    N = nodes.length,
    E = edges.length,
    sE = solvedEdges.length,
    g = {
      nodes: [],
      edges: []
    };
    sG = {
      nodes: [],
      edges: []
    };
    // Drawing original graph
    for (i = 0; i < N; i++)
      g.nodes.push({
        id: nodes[i],
        label: '' + nodes[i],
        x: (Math.random()*50|0),
        y: (Math.random()*50|0),
        size: 10,
        color: '#666'
      });
    for (i = 0; i < E; i++)
      g.edges.push({
        id: ''+ i,
        source: edges[i][0],
        target: edges[i][1],
        label:''+edges[i][2],
        minEdgeSize:10,
        maxEdgeSize:100,
        color: '#ccc'
      });
    s = new sigma({
      graph: g,
      renderer: {
        container: document.getElementById('graph-container-original'),
        type: 'canvas'
      },
      settings: {
        edgeLabelSize: 'fixed'
      }
    });
    // Drawing Solved Graph
    sG.nodes = g.nodes;
    for (i = 0; i < sE; i++)
      sG.edges.push({
        id: 'e' + i,
        source: solvedEdges[i][0],
        target: solvedEdges[i][1],
        label: ''+solvedEdges[i][2],
        minEdgeSize:10,
        maxEdgeSize:100,
        color: '#ccc'
      });
    s2 = new sigma({
      graph: sG,
      renderer: {
        container: document.getElementById('graph-container-solved'),
        type: 'canvas'
      },
      settings: {
        edgeLabelSize: 'fixed'
      }
    });
    // Initialize the dragNodes plugin:
    sigma.plugins.dragNodes(s, s.renderers[0]);
    sigma.plugins.dragNodes(s2, s2.renderers[0]);
}

var app = angular.module('ArbolExpansionMinima', []);
app.controller('ArbolExpansionMinimaController', function($scope) {
    $scope.node = {};
    $scope.source = "";
    $scope.target = "";
    $scope.weight = 0;
    $scope.graph = {
        nodes:[],
        edges:[]
    };
    $scope.kruskalNodes = ["A", "B", "C", "D", "E", "F", "G"]
    $scope.kruskalEdges = [
        ["A", "B", 7], 
        ["A", "D", 5],
        ["B", "C", 8], 
        ["B", "D", 9], 
        ["B", "E", 7],
        ["C", "E", 5],
        ["D", "E", 15], 
        ["D", "F", 6],
        ["E", "F", 8], 
        ["E", "G", 9],
        ["F", "G", 11]
    ];
    $scope.isValid = false;
    $scope.hasPath = false;
    $scope.agregarNodo = function agregarNodo(){
        $scope.kruskalNodes.push($scope.node.id);
        $scope.node = {};
        //
        $scope.calcular()
    };
    $scope.agregarArista = function agregarArista(){
        $scope.kruskalEdges.push([$scope.source, $scope.target, $scope.weight]);
        $scope.source = "";
        $scope.target = "";
        $scope.weight = 0;
        //
        $scope.calcular()
    };

    $scope.eliminarNodo = function eliminarNodo(index){
        var nodo = $scope.kruskalNodes[index];
        var aristasFiltradas = [];
        while($scope.kruskalEdges.length>0){
            var elemento = $scope.kruskalEdges.shift();
            if(!(elemento[0]==nodo||elemento[1]==nodo)){
                aristasFiltradas.push(elemento);
            }
        }
        $scope.kruskalEdges = aristasFiltradas;
        $scope.kruskalNodes.splice(index, 1);
        //
        $scope.calcular()
    };

    $scope.eliminarArista = function eliminarArista(index){
        $scope.kruskalEdges.splice(index, 1);
        //
        $scope.calcular()
    };

    $scope.calcular = function calcular(){
        var flag = false;
        var hasPath = false;
        for(var i=0; i<$scope.kruskalNodes.length;i++){
            hasPath = false;
            for(var j=0; j<$scope.kruskalEdges.length;j++){
                if($scope.kruskalEdges[j][0]==$scope.kruskalNodes[i]||$scope.kruskalEdges[j][1]==$scope.kruskalNodes[i]){
                    hasPath = true;
                    break;
                }
            }
        }
        if(hasPath){
            $scope.kruskalGraph = kruskal($scope.kruskalNodes, $scope.kruskalEdges);
            graficar($scope.kruskalNodes, $scope.kruskalEdges, $scope.kruskalGraph);    
        } else {
            alert("Existen Nodos sin conectar!");
        }
    };
    $scope.calcular()
});