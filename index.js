
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
 * Converts date in timestamp and the inverse way
 * @param { Date, UnixTimeStamp } date contains a unix timestamp or a Date Object. 
 * @param { Boolean } inverse defines which way to convert.
 */
function timeConverter(date, inverse){
  if(inverse) return Math.round(date.getTime()/1000);
  else return new Date(date*1000);
}

/**
 * Insert the first half of the sample array in the current graph
 * @param {DOM Element} graph DOM Element where the graph will be reendered
 */
function insertData(graph){
  for(k = 0; k < graph.data.length; k++){
    
    data = [graph.data[k].x, graph.data[k].y]; // takes this graph data
    sample = [graph.data[k].x, graph.data[k].y]; // makes a graph data "copy"
    newData = new Array(2);

    data[0] = convertTimeArray(data[0], true);
    sample[0] = convertTimeArray(sample[0], true);

    finalX = sample[0][sample[0].length - 1].getTime(); // saves the last time

    for(i = 0; i < data.length; i++){
      sample[i] = sample[i].slice(0, Math.floor(sample[i].length/2)); // takes the first sample's half

      if(i==0) for(j = 0; j < sample[0].length; j++){ // extends the sample x value from finalX
        sample[0][j] = new Date(finalX + (j+1)*1000*60*15);
      }

      newData[i] = new Array(data[i].length + sample[i].length);
      newData[i] = data[i].concat(sample[i]);
    }
    
    newData[0] = convertTimeArray(newData[0],false);
    graph.data[k] = generateTrace(newData, k);
  }

  Plotly.redraw(graph);
}
/** Converts timestamps in dates or dates in timestamps
    @param { Array } array timestamps or dates to be converted
    @param { Boolean } inverse dictates the order of the convertion 
 */
function convertTimeArray(array, inverse){
  for(i=0; i<array[0].length; i++){
    array[0][i] = timeConverter(array[0][i], inverse);
  }
  return array;
}

/**
 * Render the data as a cartesian graph in the DOM
 * @param {DOM Element} graph DOM Element where the graph will be reendered
 * @param {Array} data current data from plotted graph
 */
function renderGraph(graph, data){
  Plotly.newPlot(graph, generateTrace(data, true), layout);
}

/** Format the data array as object to Plotly functions
  * @param { Array } data contains y and x values 
  * @param { Integer } i selects the trace name and axis
 */
function generateTrace(data, i){
  return  {
      name: i == 0? 'Ventilation unit cooling coil' : i==1? 'Outside Air Temperature,': i==2? 'Ventilation unit supply': 'Room temperature',
      x:data[0],
      y:data[1],
      type: 'scatter',
      yaxis: i==0? 'y2': undefined,
    };
}

var firstDataSet = window.datasets['15360'];
var secondDataSet = window.datasets['15361'];
var thirdDataSet = window.datasets['15377'];
var fourthDataSet = window.datasets['17006'];
var dataSets = [firstDataSet, secondDataSet, thirdDataSet, fourthDataSet];
var layout = {
  title: 'Cooling System and Temperatures',
  xaxis: {
    autotick: false,
    ticks: 'outside',
    dtick: 1000*60*60*24*30,
    rangeselector: selectorOptions,
    rangeslider: {}
  },
  yaxis: {
    fixedrange: true,
    autotick: false,
    title: 'Temperature',
    ticksuffix:'ºC',
    dtick: 10,
    ticks: 'outside',
    side: 'left',
  },
  yaxis2: {
    fixedrange: true,
    autotick: false,
    title: 'Potential Savings',
    ticksuffix:'%',
    dtick: 20,
    overlaying: 'y', 
    side: 'right',
  }
};

var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
};

//first Render
desData = [];
aio = new Array(4);
for(var i = 0; i < 4; i++){
  desData[i] = desserializeData(dataSets[i]);
  for(j = 0; j < desData[i][0].length; j++){
    desData[i][0][j] = desData[i][0][j] == null? null : timeConverter(desData[i][0][j], false);
  }
  aio[i] =  generateTrace(desData[i], i);
}

Plotly.plot('aio', aio, layout);