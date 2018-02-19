(function () {

  // constants
  var CSV_DIR = 'csv/';

  // app variables
  var data = {
    loadCount: 0,
    sources: ['car','truck']
  };
  var numericValues = ['gallons', 'miles', 'mpg', 'price'];
  var utils = {
    mapKeys: function (obj, delimeter) {
      var o = {};

      Object.keys(obj).forEach(function (key) {
        var val = obj[key];

        key = key.split(delimeter).map(function (str,idx) {
          if (idx !== 0) {
            return str[0].toUpperCase() + str.substr(1,str.length);
          } else return str;
        }).join('');

        o[key] = val;
      });

      return o;
    },
    toNumber: function (str) {
      // see https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls
      return +str;
    },
    toDate: function (str) {
      // assumes dateAdded: "2018-02-01 13:45:00" => ISO 8601
      return new Date(str.split(' ').join('T') + 'Z');
    }
  };

  function cleanData (datum) {
    datum = utils.mapKeys(datum, '_');
    datum.dateAdded = utils.toDate(datum.dateAdded);
    numericValues.forEach(function (key) {
      datum[key] = utils.toNumber(datum[key]);
    });
    return datum;
  }

  function loadData () {
    data.sources.forEach(function (source) {
      loadCsv(source);
    });
  }

  function loadCsv (filename) {
    // a => row obj
    // b => base zero row index
    // c => row obj key names as an array of strings
    d3.csv(CSV_DIR + filename + '.csv', cleanData, function (error, fileData) {
      if (error) {
        throw error;
        return;
      }
      setData(filename, fileData);
    });
  }

  function loadFinished () {
    console.log(data);

    charts.mpgTrendSingle(d3.select('#mpg-trend-car'), data.car.data, function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);

    });

    charts.mpgTrendSingle(d3.select('#mpg-trend-truck'), data.truck.data, function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);

    });

    charts.pricePerGallon(d3.select('#price-per-gallon-combined'), [].concat(data.car.data, data.truck.data), function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);

    });

    var formatter = function (d3svg) {
      d3svg
        .classed('bar-chart', true)
        .selectAll('.axis-x .tick text')
          .attr('transform', 'rotate(-60, 0, 0)')
          .attr('dy', 3)
          .attr('dx', -30);
    };

    charts.costPerMonth(d3.select('#cost-per-month-car'), data.car.data, formatter);
    charts.costPerMonth(d3.select('#cost-per-month-truck'), data.truck.data, formatter);
    charts.costPerMonth(d3.select('#cost-per-month-combined'), [].concat(data.car.data, data.truck.data), formatter);

    charts.milesPerFill(d3.select('#miles-per-fill-car'), data.car.data, function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);
    });

    charts.milesPerFill(d3.select('#miles-per-fill-truck'), data.truck.data, function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);
    });

    charts.mpgTrendCombined(d3.select('#mpg-trend-combined'), [].concat(data.car.data, data.truck.data), function (d3svg) {
      d3svg
        .classed('line-chart', true)
        .select('.line')
          .attr('stroke-width', 1);

      d3svg
        .selectAll('.axis-x .tick text')
        .attr('transform', 'rotate(-60, 0, 0)')
        .attr('dy', 3)
        .attr('dx', -30);
    });

  }

  function setData (source, fileData) {
    data.loadCount++;

    data[source] = {
      data: fileData || null
    };

    if (data.loadCount === data.sources.length) {
      loadFinished();
    }
  }

  loadData();

})();
