function desserializeData(dataset){
  var aux = new Array(2);
  aux[0] = new Array(dataset.length)
  aux[1] = new Array(dataset.length)
  var i = 0;

  while(i < dataset.length){
    aux[0][i] = timeConverter(dataset[i]["0"]);
    aux[1][i] = dataset[i]["1"];
    i++;
  }
  return aux;
}

function timeConverter(time){
  return new Date(time).toString();
}

var firstGraph = document.getElementById('first');
var secondGraph = document.getElementById('second');
var thirdGraph = document.getElementById('third');
var fourthGraph = document.getElementById('fourth');
var graphs = [firstGraph, secondGraph, thirdGraph, fourthGraph];

var firstDataSet = window.datasets['15360'];
var secondDataSet = window.datasets['15361'];
var thirdDataSet = window.datasets['15377'];
var fourthDataSet = window.datasets['17006'];
var dataSets = [firstDataSet, secondDataSet, thirdDataSet, fourthDataSet];

var data = [];

for(i=0; i<dataSets.length; i++){
  data.push(desserializeData(dataSets[i]));
} 


for(var i = 0; i < graphs.length; i++){

  var layout = {
    xaxis: {
      smoothing: 1,
      minorgridcount: 9,
    },
    yaxis: {
      ticksuffix: i == 0 ? '%':'ºC',
      smoothing: 1,
      minorgridcount: 9,
    },
  };

  Plotly.newPlot(graphs[i], [{x:data[i][0],y:data[i][1]}], layout);
}
