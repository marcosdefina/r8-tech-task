TESTER = document.getElementById('tester');

var firstX = [window.datasets['15360'].length];
var firstY = [window.datasets['15360'].length];
var secondX = [];
var secondY = [];
var thirdX = [];
var thirdY = [];
var fourthX = [];
var fourthY = [];

var firstDataSet = window.datasets['15360'];
var secondDataSet = window.datasets['15361'];
var thirdDataSet = window.datasets['15377'];
var fourthDataSet = window.datasets['17006'];


function desserializeData(x, y, dataset){
  var i = 0;

  while(i < dataset.length){
    x[i] = timeConverter(dataset[i]["0"]);
    y[i] = dataset[i]["1"];
    i++;
  }
}

function timeConverter(time){
  return new Date(time).toString();
}

desserializeData(firstX, firstY, firstDataSet); 
desserializeData(secondX, secondY, secondDataSet); 
desserializeData(thirdX, thirdY, thirdDataSet); 
desserializeData(fourthX, fourthY, fourthDataSet); 

firstGraph = document.getElementById('first');
secondGraph = document.getElementById('second');
thirdGraph = document.getElementById('third');
fourthGraph = document.getElementById('fourth');

Plotly.plot( firstGraph, 
    [{
      x: firstX, y:firstY
    }],
    { 
      margin: { t: 0 }
    },
    {showSendToCloud:true}
);

Plotly.plot( secondGraph, 
    [{
      x: secondX, y: secondY
    }], 
    { 
      margin: { t: 0 }
    },
    {showSendToCloud:true}
);

Plotly.plot( thirdGraph, 
    [{
      x: thirdX, y: thirdY
    }], 
    { 
      margin: { t: 0 }
    },
    {showSendToCloud:true}
);
Plotly.plot( fourthGraph, 
    [{
      x: fourthX, y: fourthY
    }], 
    { 
      margin: { t: 0 }
    },
    {showSendToCloud:true}
);

/* Current Plotly.js version */

console.log("firstX:")
console.log(firstX)
console.log("firstY:")
console.log(firstY)
console.log(window.datasets['15360'])