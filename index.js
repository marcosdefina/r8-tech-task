function desserializeData(dataset){
  var data = [];
  var i = 0;

  while(i < dataset.length){
    data[i].push(timeConverter(dataset[i]["0"]));
    data[i].push(dataset[i]["1"]);
    i++;
  }
  return data;
}

function timeConverter(time){
  return new Date(time).toString();
}

function plot(data, dom){
  Plotly.plot( dom, 
      [{
        x: data[0], y:data[0]
      }],
      { 
        margin: { t: 0 }
      },
      {showSendToCloud:true}
  );
}

var firstDataSet = window.datasets['15360'];
var secondDataSet = window.datasets['15361'];
var thirdDataSet = window.datasets['15377'];
var fourthDataSet = window.datasets['17006'];
var datasets = [firstDataSet, secondDataSet, thirdDataSet, fourthDataSet];

var data;
for(var dataset in datasets){
  data.push(desserializeData(dataset));
} 

var firstGraph = document.getElementById('first');
var secondGraph = document.getElementById('second');
var thirdGraph = document.getElementById('third');
var fourthGraph = document.getElementById('fourth');
var graphs = [firstGraph, secondGraph, thirdGraph, fourthGraph];

for(var graph in graphs){
  plot(data[graphs.indexOf(graph)] ,graph);
}