
/**
 * Organize the data in a usable way
 * @param {Array} dataset Contains two arrays which corresponds to the y and x axis.
 */
function desserializeData(dataset){
  var aux = new Array(2);
  aux[0] = new Array(dataset.length);
  aux[1] = new Array(dataset.length);
  var i = 0;

  while(i < dataset.length){
    aux[0][i] = dataset[i]["0"];
    aux[1][i] = dataset[i]["1"];
    i++;
  }
  return aux;
}

/**
 * Purge unecessary time data, to be easier to see in the DOM
 * @param {Date} time contains a unix timestamp. 
 */
function timeConverter(unixStamp){
  date = new Date(unixStamp*1000);
  
  hours = date.getHours();
  minutes = "0" + date.getMinutes();
  seconds = "0" + date.getSeconds();

  formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  
  return formattedTime;
}

/**
 * Insert the first half of the sample array in the current graph
 * @param {DOM Element} graph DOM Element where the graph will be reendered
 */
function insertData(graph){
  
  data = [graph.data[0].x, graph.data[0].y]; // takes this graph data
  sample = [graph.data[0].x, graph.data[0].y]; // makes a graph data "copy"
  newData = new Array(2);

  finalX = sample[0][sample[0].length - 1]; // saves the last time

  for(i = 0; i < data.length; i++){
    sample[i] = sample[i].slice(0, Math.floor(sample[i].length/2)); // takes the first sample's half

    if(i==0) for(j = 0; j < sample[0].length; j++){ // extends the sample x value from finalX
      sample[0][j] = finalX + j*1000 + 1;
    }

    newData[i] = new Array(data[i].length + sample[i].length);
    newData[i] = data[i].concat(sample[i]);
  }

  console.log(newData);

  graph.data = generateTrace(newData);
  Plotly.redraw(graph);
}

/**
 * Render the data as a cartesian graph in the DOM
 * @param {DOM Element} graph DOM Element where the graph will be reendered
 * @param {Array} data current data from plotted graph
 */
function renderGraph(graph, data){
  var layout = {
    xaxis: {
      smoothing: 1,
      minorgridcount: 9,
    },
    yaxis: {
      ticksuffix: i == 0 ? '%':'ºC', //Hardcoded, try to improve
      smoothing: 1,
      minorgridcount: 9,
    },
  };
  Plotly.newPlot(graph, generateTrace(data, true), layout);
}

/** Format the data array as object to Plotly functions
  * @param { Array } data contains y and x values 
 */
function generateTrace(data, i){
  if(i)
    return [{x:data[0], y:data[1]}];
  else 
    return {name:'',x:data[0], y:data[1]};
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

//first Render
desData = [];
aio = new Array(4);
for(var i = 0; i < graphs.length; i++){
  desData[i] = desserializeData(dataSets[i]);
  renderGraph(graphs[i], desData[i]);
  aio[i] =  {
    x: timeConverter(desData[i][0]),
    y: desData[i][1],
    type: 'scatter'
  };
}

var layout = {
  xaxis: {
    autotick: false,
    ticks: 'outside',
    tick0: 0,
    dtick: 0.25,
    ticklen: 8,
    tickwidth: 4,
    tickcolor: '#000'
  },
  yaxis: {
    autotick: false,
    ticks: 'outside',
    tick0: 0,
    dtick: 0.25,
    ticklen: 8,
    tickwidth: 4,
    tickcolor: '#000'
  },
  yaxis2: {
  title: 'trace0',
  side: 'right'
}
};

Plotly.newPlot(document.getElementById('aio'), aio);