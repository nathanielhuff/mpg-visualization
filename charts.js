var charts = (function () {

  function costPerMonth (d3svg, data, formatter) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };
    var width = +d3svg.attr('width') - margin.left - margin.right;
    var height = +d3svg.attr('height') - margin.top - margin.bottom;
    var yearMonths = {};

    // sort by date added, ascending
    data.sort(function (a,b) {
      if (a.dateAdded < b.dateAdded) return -1;
      if (a.dateAdded > b.dateAdded) return 1;
      return 0;
    });

    // pull out the data we want
    data.forEach(function (datum) {
      var ym = d3.timeFormat('%Y-%m')(datum.dateAdded);

      if (!yearMonths[ym]) {
        yearMonths[ym] = [];
      }

      yearMonths[ym].push(datum.price * datum.gallons);
    });

    data = [];

    Object.keys(yearMonths).forEach(function (ym) {
      data.push({
        yearMonth: ym,
        cost: yearMonths[ym].reduce(function (a, b) {
          return a + b;
        }, 0)
      });
    });

    console.log(data);

    var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    xScale.domain(data.map(function (d) { return d.yearMonth; }));
    yScale.domain([0, d3.max(data, function (d) { return d.cost })]).nice();

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('$.2f'));

    var g = d3svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    g.append('g')
        .attr('class', 'axis axis-y')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return xScale(d.yearMonth); })
        .attr('y', function (d) { return yScale(d.cost); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d.cost); });

    if (typeof formatter === 'function') {
      return formatter(d3svg);
    }
  }

  function pricePerGallon (d3svg, data, formatter) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };
    var width = +d3svg.attr('width') - margin.left - margin.right;
    var height = +d3svg.attr('height') - margin.top - margin.bottom;

    // sort by date added, ascending
    data.sort(function (a,b) {
      if (a.dateAdded < b.dateAdded) return -1;
      if (a.dateAdded > b.dateAdded) return 1;
      return 0;
    });

    // filter the data
    data = data.filter(function (d) {
      return {
        dateAdded: d3.timeFormat('%Y-%m-%d')(d.dateAdded),
        price: d.price
      };
    });

    // scales
    var xScale = d3.scaleTime().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    // create a line
    var line = d3.line()
      .x(function(d) { return xScale(d.dateAdded); })
      .y(function(d) { return yScale(d.price); });

    // set the domain
    xScale.domain(d3.extent(data, function(d) { return d.dateAdded; }));
    yScale.domain(d3.extent(data, function(d) { return d.price; })).nice();

    // create the outer g tag
    var g = d3svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the x-axis
    var xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y-%m'));

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // add the y-axis
    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('$.2f'));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    // add the path that represents the data
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'line')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // add some dots to the line for each data point
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .style('fill', 'firebrick')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 1.5);

    if (typeof formatter === 'function') {
      return formatter(d3svg);
    }
  }

  function mpgTrendSingle (d3svg, data, formatter) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };
    var width = +d3svg.attr('width') - margin.left - margin.right;
    var height = +d3svg.attr('height') - margin.top - margin.bottom;

    // sort by date added, ascending
    data.sort(function (a,b) {
      if (a.dateAdded < b.dateAdded) return -1;
      if (a.dateAdded > b.dateAdded) return 1;
      return 0;
    });

    // filter the data
    data = data.filter(function (d) {
      return {
        dateAdded: d3.timeFormat('%Y-%m-%d')(d.dateAdded),
        mpg: d.mpg
      };
    });

    // scales
    var xScale = d3.scaleTime().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    // create a line
    var line = d3.line()
      .x(function(d) { return xScale(d.dateAdded); })
      .y(function(d) { return yScale(d.mpg); });

    // set the domain
    xScale.domain(d3.extent(data, function(d) { return d.dateAdded; }));
    yScale.domain(d3.extent(data, function(d) { return d.mpg; })).nice();

    // create the outer g tag
    var g = d3svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the x-axis
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat('%Y-%m'));

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // add the y-axis
    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('.1f'));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    // add the path that represents the data
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'line')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // add some dots to the line for each data point
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .style('fill', 'firebrick')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 1.5);

    if (typeof formatter === 'function') {
      return formatter(d3svg);
    }
  }

  function mpgTrendCombined (d3svg, data, formatter) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };
    var width = +d3svg.attr('width') - margin.left - margin.right;
    var height = +d3svg.attr('height') - margin.top - margin.bottom;

    // sort by date added, ascending
    data.sort(function (a,b) {
      if (a.dateAdded < b.dateAdded) return -1;
      if (a.dateAdded > b.dateAdded) return 1;
      return 0;
    });

    // filter the data
    data = data.filter(function (d) {
      return {
        carName: d.carName,
        dateAdded: d3.timeFormat('%Y-%m-%d')(d.dateAdded),
        mpg: d.mpg
      };
    });

    // scales
    var xScale = d3.scaleTime().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    // create line for Honda
    var hondaLine = d3.line()
      .x(function(d) { if (d.carName.toLowerCase().indexOf('honda') > -1) return xScale(d.dateAdded); })
      .y(function(d) { if (d.carName.toLowerCase().indexOf('honda') > -1) return yScale(d.mpg); });

    // create line for Tacoma
    var tacomaLine = d3.line()
      .x(function(d) { if (d.carName.toLowerCase().indexOf('tacoma') > -1) return xScale(d.dateAdded); })
      .y(function(d) { if (d.carName.toLowerCase().indexOf('tacoma') > -1) return yScale(d.mpg); });

    // set the domain
    xScale.domain(d3.extent(data, function(d) { return d.dateAdded; }));
    yScale.domain(d3.extent(data, function(d) { return d.mpg; })).nice();

    // create the outer g tag
    var g = d3svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the x-axis
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat('%Y-%m'));

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // add the y-axis
    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('.1f'));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    // add the paths that represents the data
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'line line-honda')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', hondaLine);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'line line-tacoma')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', tacomaLine);

    // add some dots to the line for each data point
    /*g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .style('fill', 'firebrick')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 1.5);*/

    if (typeof formatter === 'function') {
      return formatter(d3svg);
    }
  }

  function milesPerFill (d3svg, data, formatter) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 60
    };
    var width = +d3svg.attr('width') - margin.left - margin.right;
    var height = +d3svg.attr('height') - margin.top - margin.bottom;
    var yearWeeks = {};

    // sort by date added, ascending
    data.sort(function (a,b) {
      if (a.dateAdded < b.dateAdded) return -1;
      if (a.dateAdded > b.dateAdded) return 1;
      return 0;
    });

    // filter the data
    data = data.filter(function (d) {
      return {
        dateAdded: d3.timeFormat('%Y-%m-%d')(d.dateAdded),
        miles: d.miles
      };
    });

    // scales
    var xScale = d3.scaleTime().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    // create a line
    var line = d3.line()
      .x(function(d) { return xScale(d.dateAdded); })
      .y(function(d) { return yScale(d.miles); });

    // set the domain
    xScale.domain(d3.extent(data, function(d) { return d.dateAdded; }));
    yScale.domain(d3.extent(data, function(d) { return d.miles; })).nice();

    // create the outer g tag
    var g = d3svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the x-axis
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeSunday.every(2))
      .tickFormat(d3.timeFormat('%Y-%U'));

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // add the y-axis
    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('.1f'));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    // add the path that represents the data
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'line')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // add some dots to the line for each data point
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .style('fill', 'firebrick')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 1.5);

    if (typeof formatter === 'function') {
      return formatter(d3svg);
    }

  }

  return {
    costPerMonth: costPerMonth,
    pricePerGallon: pricePerGallon,
    mpgTrendSingle: mpgTrendSingle,
    mpgTrendCombined: mpgTrendCombined,
    milesPerFill: milesPerFill
  };

})();
