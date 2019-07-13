/**
 * A compiled of methods to compute the standard deviation of arrays of data
 * @module StandardDeviationClass
 */
/** StandardDeviationClass description */
export class StandardDeviationClass{
  /** Return the standard deviation of the data
      @param { Array } values outcome of the data, y axis.
  */
  standardDeviation(values){
    var avgSquareDiff = avarage(squareDiff(values));
    return Math.sqrt(avgSquareDiff);
  }

  /** Returns the average point of the data
    @param { Array } values array containing data to take avarage
  */
  avarageValue(values){
    var sum = values.reduce(function(sum, value){
      return sum+value;
    });

    return sum / data.length;
  }

  /** Returns an array of avarages between data
      @param { Array } values contains the data values
  */
  avarageData(values){
      var diffs = values.map(function(value){
      var diff = value - avg;
      return diff;
    });

    return diffs;
  }

  /** Returns the Square Difference array
    @param { Array } values array of data
  */
  squareDiff(values){
      var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqr = diff * diff;
      return sqr;
    });
    return squareDiffs;
  }
}


/**
 * A compiled of methods to compute the laplacian transform of a dataset
 * @module Laplacian
 */
/** StandardDeviationClass description */
export class Laplacian{
  sgn(x) {
      return x < 0 ? -1 : 1;
  }

  // From wikipedia:
  // Lap(X) = mu - b sgn(U) ln (1-2|U|) where U is a random variable between -0.5 and 0.5
  laplace(mu, b) {
      var U = Math.random() - 0.5;
      return mu - (b * sgn(U) * Math.log(1 - 2* Math.abs(U)));
  }

  privatize(F,deltaF,epsilon) {
      return F + laplace(0.0, deltaF/epsilon);
  }
}