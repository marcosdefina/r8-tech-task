
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
      line: {widht:1},
      mode:'scatter',
      type:'line',
      x:data[0],
      y:data[1],
    }
  ];
}
function fourierTransform(graph){
  transformation = rfft(graph.data[0].y.slice(0,8192), graph.data[0].y.slice(0,8192));
  graph.data[0].y = transformation;
  Plotly.redraw(graph)
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

function rfft (input, spectrum) {
	if (!input) throw Error("Input waveform is not provided, pass input array.")

	var N = input.length

	var k = Math.floor(Math.log(N) / Math.LN2)

	if (Math.pow(2, k) !== N) throw Error("Invalid array size, must be a power of 2.")

	if (!spectrum) spectrum = new Array(N/2)

	//.forward call
	var n         = N,
		x         = new Array(N),
		TWO_PI    = 2*Math.PI,
		sqrt      = Math.sqrt,
		i         = n >>> 1,
		bSi       = 2 / n,
		n2, n4, n8, nn,
		t1, t2, t3, t4,
		i1, i2, i3, i4, i5, i6, i7, i8,
		st1, cc1, ss1, cc3, ss3,
		e,
		a,
		rval, ival, mag

	reverseBinPermute(N, x, input)

	for (var ix = 0, id = 4; ix < n; id *= 4) {
		for (var i0 = ix; i0 < n; i0 += id) {
			//sumdiff(x[i0], x[i0+1]) // {a, b}  <--| {a+b, a-b}
			st1 = x[i0] - x[i0+1]
			x[i0] += x[i0+1]
			x[i0+1] = st1
		}
		ix = 2*(id-1)
	}

	n2 = 2
	nn = n >>> 1

	while((nn = nn >>> 1)) {
		ix = 0
		n2 = n2 << 1
		id = n2 << 1
		n4 = n2 >>> 2
		n8 = n2 >>> 3
		do {
			if(n4 !== 1) {
				for(i0 = ix; i0 < n; i0 += id) {
					i1 = i0
					i2 = i1 + n4
					i3 = i2 + n4
					i4 = i3 + n4

					//diffsum3_r(x[i3], x[i4], t1) // {a, b, s} <--| {a, b-a, a+b}
					t1 = x[i3] + x[i4]
					x[i4] -= x[i3]
					//sumdiff3(x[i1], t1, x[i3])   // {a, b, d} <--| {a+b, b, a-b}
					x[i3] = x[i1] - t1
					x[i1] += t1

					i1 += n8
					i2 += n8
					i3 += n8
					i4 += n8

					//sumdiff(x[i3], x[i4], t1, t2) // {s, d}  <--| {a+b, a-b}
					t1 = x[i3] + x[i4]
					t2 = x[i3] - x[i4]

					t1 = -t1 * Math.SQRT1_2
					t2 *= Math.SQRT1_2

					// sumdiff(t1, x[i2], x[i4], x[i3]) // {s, d}  <--| {a+b, a-b}
					st1 = x[i2]
					x[i4] = t1 + st1
					x[i3] = t1 - st1

					//sumdiff3(x[i1], t2, x[i2]) // {a, b, d} <--| {a+b, b, a-b}
					x[i2] = x[i1] - t2
					x[i1] += t2
				}
			} else {
				for(i0 = ix; i0 < n; i0 += id) {
					i1 = i0
					i2 = i1 + n4
					i3 = i2 + n4
					i4 = i3 + n4

					//diffsum3_r(x[i3], x[i4], t1) // {a, b, s} <--| {a, b-a, a+b}
					t1 = x[i3] + x[i4]
					x[i4] -= x[i3]

					//sumdiff3(x[i1], t1, x[i3])   // {a, b, d} <--| {a+b, b, a-b}
					x[i3] = x[i1] - t1
					x[i1] += t1
				}
			}

			ix = (id << 1) - n2
			id = id << 2
		} while (ix < n)

		e = TWO_PI / n2

		for (var j = 1; j < n8; j++) {
			a = j * e
			ss1 = Math.sin(a)
			cc1 = Math.cos(a)

			//ss3 = sin(3*a) cc3 = cos(3*a)
			cc3 = 4*cc1*(cc1*cc1-0.75)
			ss3 = 4*ss1*(0.75-ss1*ss1)

			ix = 0; id = n2 << 1
			do {
				for (i0 = ix; i0 < n; i0 += id) {
					i1 = i0 + j
					i2 = i1 + n4
					i3 = i2 + n4
					i4 = i3 + n4

					i5 = i0 + n4 - j
					i6 = i5 + n4
					i7 = i6 + n4
					i8 = i7 + n4

					//cmult(c, s, x, y, &u, &v)
					//cmult(cc1, ss1, x[i7], x[i3], t2, t1) // {u,v} <--| {x*c-y*s, x*s+y*c}
					t2 = x[i7]*cc1 - x[i3]*ss1
					t1 = x[i7]*ss1 + x[i3]*cc1

					//cmult(cc3, ss3, x[i8], x[i4], t4, t3)
					t4 = x[i8]*cc3 - x[i4]*ss3
					t3 = x[i8]*ss3 + x[i4]*cc3

					//sumdiff(t2, t4)   // {a, b} <--| {a+b, a-b}
					st1 = t2 - t4
					t2 += t4
					t4 = st1

					//sumdiff(t2, x[i6], x[i8], x[i3]) // {s, d}  <--| {a+b, a-b}
					//st1 = x[i6] x[i8] = t2 + st1 x[i3] = t2 - st1
					x[i8] = t2 + x[i6]
					x[i3] = t2 - x[i6]

					//sumdiff_r(t1, t3) // {a, b} <--| {a+b, b-a}
					st1 = t3 - t1
					t1 += t3
					t3 = st1

					//sumdiff(t3, x[i2], x[i4], x[i7]) // {s, d}  <--| {a+b, a-b}
					//st1 = x[i2] x[i4] = t3 + st1 x[i7] = t3 - st1
					x[i4] = t3 + x[i2]
					x[i7] = t3 - x[i2]

					//sumdiff3(x[i1], t1, x[i6])   // {a, b, d} <--| {a+b, b, a-b}
					x[i6] = x[i1] - t1
					x[i1] += t1

					//diffsum3_r(t4, x[i5], x[i2]) // {a, b, s} <--| {a, b-a, a+b}
					x[i2] = t4 + x[i5]
					x[i5] -= t4
				}

				ix = (id << 1) - n2
				id = id << 2

			} while (ix < n)
		}
	}

	while (--i) {
		rval = x[i]
		ival = x[n-i-1]
		mag = bSi * sqrt(rval * rval + ival * ival)
		spectrum[i] = mag
	}

	spectrum[0] = Math.abs(bSi * x[0])

	return spectrum
}


function reverseBinPermute (N, dest, source) {
	var halfSize    = N >>> 1,
		nm1         = N - 1,
		i = 1, r = 0, h

	dest[0] = source[0]

	do {
		r += halfSize
		dest[i] = source[r]
		dest[r] = source[i]

		i++

		h = halfSize << 1

		while (h = h >> 1, !((r ^= h) & h)) {}

		if (r >= i) {
			dest[i]     = source[r]
			dest[r]     = source[i]

			dest[nm1-i] = source[nm1-r]
			dest[nm1-r] = source[nm1-i]
		}
		i++
	} while (i < halfSize)

	dest[nm1] = source[nm1]
}
