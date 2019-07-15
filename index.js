
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
function timeConverter(time){
  aux = new Date(time);
  
  min = aux.getMinutes();
  min = min > 10? min : '0' + min;
  min = min == '010'? '01' : min;
  
  sec = aux.getSeconds();
  sec = sec > 10? sec : '0' + sec;
  sec = sec == '010'? '01' : sec;
  
  result =  aux.getHours() + ':' + min + ':' + sec;
  
  return result;
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
  Plotly.newPlot(graph, generateTrace(data), layout);
}

/** Format the data array as object to Plotly functions
  * @param { Array } data contains y and x values 
 */
function generateTrace(data){
  return [
    {
      line: {width: 1},
      mode:'scatter',
      type:'line',
      x:data[0],
      y:data[1],
    },
  ];
}

function traceAvarage(graph){
  result = 0;
  data = graph.data[0].y;
  len = data.length;
  aux = new Array(len);
  for(i = 0; i < len; i++){
    result += data[i];
  }

  result = result/len;
  
  for(i = 0; i < len; i++ ) aux[i] = result;

  graph.data[1] = graph.data[0];
  graph.data[1] = { name:'avarage', y: aux, x: graph.data[0].x};
  Plotly.redraw(graph);
}

function fourierTransform(graph){
  instance = new FastFourierTransform();

  len = graph.data[0].y.length;
  len = len < 8192? 4096 : 8192;

  transformation = instance.rfft(graph.data[0].y.slice(0,len), graph.data[0].y.slice(0,len));
  graph.data[0].y = transformation;
    var layout = {
    xaxis: {
      smoothing: 1,
      minorgridcount: 9,
      ticksuffix: 'ºC',
    },
    yaxis: {
      ticksuffix: 'Hz', //Hardcoded, try to improve
      smoothing: 1,
      minorgridcount: 9,
    },
  };
  graph.layout = layout;
  Plotly.redraw(graph);
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
for(var i = 0; i < graphs.length; i++){
  renderGraph(graphs[i], desserializeData(dataSets[i]));
}
