Array.prototype.equals = function (array, strict) {
    if (!array)
        return false;

    if (arguments.length == 1)
        strict = true;

    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i], strict))
                return false;
        }
        else if (strict && this[i] != array[i]) {
            return false;
        }
        else if (!strict) {
            return this.sort().equals(array.sort(), true);
        }
    }
    return true;
}


    var calcScores = function(data, players) {

      /* take players as an array, validate and then create an array */

      if (players.length != 3) return;

      var store = [];

      for (var i=0;i<players.length;i++) {
        store[i] = {name: players[i], score: 0, loss: 0, round1: 0, round2:0, round3: 0, trend: [{game: 0, value: 0}]}
      }

      var trendScore = [0,0,0]

      /*Filter games just for those with the right players*/
      var games = [];

      data.forEach(function(game, index) {
        if (players.equals([game.game.winner, game.game.loser, game.game.middle], false)) {
          games.push(game)


        }
      })



      /* iterate over games to calculate scores for the right players*/
      games.forEach(function(game, index) {
        var winner = game.game.winner,
            loser = game.game.loser

        //iterate through all of the players (there might be more than three)
        for (var j=0;j<store.length; j++) {

          //assign the winner and the loser scores
          if (store[j]['name'] == winner) {
              store[j]['score']++;
              trendScore[j]++;

          }
          else if (store[j]['name'] == loser) {
              store[j]['loss']++;
          }

          //for each score in the game
          for (var i = 0; i < game.scores.length; i++) {

            //find the player
            var player = game.scores[i].name

            //update the players scores
            if (store[j].name == player) {
              if (game.scores[i].score1 === 3) {
                store[j].round1 += 1
              }
              if (game.scores[i].score2 === 3) {
                store[j].round2 += 1
              }
              if (game.scores[i].score3 === 3) {
                store[j].round3 += 1
              }
            }
          }

          store[j].trend.push({game: (index+1), value: trendScore[j]})

        }
      })

      return store;



    }


    var updateCharts = function(svg,charts, Person,players) {
      var scores = calcScores(Person, players);

      position = {}

      position.x = 0;
      position.y = 230;


      updateLineChart(svg,scores, null, null);

      d3.selectAll('.x.axis.bar').remove()

      var position = {
        x: 0,
        y: 0
      },
      label;

      for (var i=0; i<charts.length; i++) {

        position.x = 140*i;

        label = charts[i].label;

        scores.forEach(function(d) {
          d.value = d[charts[i].value];
        })

        updateBarChart(svg, scores, null, position, null,label);
      }
    }

    //draw bar charts
    var drawCharts = function(svg, charts, Person, players) {
      var scores = calcScores(Person, players);

      // set the height based on the calculations above


      //draw charts
      var position = {
        x: 0,
        y: 0
      },
      label;

      for (var i=0; i<charts.length; i++) {

        position.x = 140*i;

        label = charts[i].label;

        scores.forEach(function(d) {
          d.value = d[charts[i].value];
        })

        drawBarChart(svg, scores, null, null, position, label)
      }

      position.x = 0;
      position.y = 230;

      drawLineChart(svg,scores, null, null, position, null)
    }

    var drawBarChart = function(svg,data, margin, dimension, position, labels) {

      //don't do anything unless you have data and a position for the chart
      if (!data || !position) return;

      // check for context, and apply generic context if you don't get context
      if(!labels) {
        labels = {
          title:'N/A',
          barClass: 'bars',
          labelClass: 'labels'
        }
      }

      if(!margin) {
        margin = {
          top: 25,
          bottom: 45,
          left: 0,
          right: 20
        };
      }

      if(!dimension) {
        dimension = {
          height: 100,
          width: 100
        }
      }

      //assign color
      var color = d3.scale.category20(),

          xScale = d3.scale.ordinal()
            .rangeRoundBands([0, 100], .1);


      //create data scales
      xScale.domain(data.map(function(d) {return d.name;}))

      xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0)
        .tickPadding(10)
        .orient("bottom");

      // our yScale
      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return Math.max(d.score, d.loss, d.round1, d.round2, d.round3);
        })])
        .range([dimension.height, 0]);




      var chart = svg
      .append('g')
      .attr('transform', "translate(" + (margin.left + position.x) + "," + (margin.top + 20) + ")")

      chart.append('text')
        .text(labels.title)
        .attr('transform', 'translate(0, -30)')

      var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + xScale(d.name) + ",0)"; });

      //create the rectangles for the bar chart
      bar.append('rect')
        .attr('class', labels.barClass)
        .attr("y", function(d) { return yScale(d.value) })
        .attr("height", function(d) { return dimension.height - yScale(d.value); })
        .attr("width", xScale.rangeBand())
        .attr('fill', function(d) { return color(d.name); })


      bar.append('text')
        .attr('class', labels.labelClass)
        .attr("y", function(d) { return yScale(d.value) - 5; })
        .attr('x', xScale.rangeBand()/2)
        .attr('text-anchor', 'middle')
        .text(function(d) {return d.value})

      svg.append("g")
        .attr("class", "x axis bar")
        .attr("transform", "translate("+ (margin.left + position.x) +"," + (dimension.height + margin.top + 20) + ")")
        .call(xAxis);

    }

    var updateBarChart = function(svg,data, margin, position, dimension, labels) {

      if(!dimension) {
        dimension = {
          height: 100,
          width: 200
        }
      }

      if(!margin) {
        margin = {
          top: 25,
          bottom: 45,
          left: 0,
          right: 20
        };
      }

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return Math.max(d.score, d.loss, d.round1, d.round2, d.round3);
        })])
        .range([dimension.height, 0]);

        var color = d3.scale.category20(),

            xScale = d3.scale.ordinal()
              .rangeRoundBands([0, 100], .1);

        xScale.domain(data.map(function(d) {return d.name;}))

        xAxis = d3.svg.axis()
          .scale(xScale)
          .tickSize(0)
          .tickPadding(10)
          .orient("bottom");

        svg.append("g")
          .attr("class", "x axis bar")
          .attr("transform", "translate("+ (margin.left + position.x) +"," + (dimension.height + margin.top + 20) + ")")
          .call(xAxis);


      var bars = d3.selectAll('.' + labels.barClass);

      bars.data(data).transition().delay(100).duration(750)
        .attr("y", function(d) { return yScale(d.value) })
        .attr("height", function(d) { return 100 - yScale(d.value); })


      var labels = d3.selectAll('.' + labels.labelClass);

      labels.data(data).transition().delay(100).duration(750)
        .attr("y", function(d) { return yScale(d.value) - 5; })
        .text(function(d) {return d.value});

    }




    //draw line chart
    var drawLineChart = function(svg,data, margin, dimension, position, labels) {
      if (!data || !position) return;

      if(!labels) {
        labels = {
          title:'N/A',
          lineClass: 'lines',
          labelClass: 'labels'
        }
      }

      if(!margin) {
        margin = {
          top: 25,
          bottom: 45,
          left: 0,
          right: 20
        };
      }

      if(!dimension) {
        dimension = {
          height: 130,
          width: 660
        }
      }

      var color = d3.scale.category20();

      var x = d3.scale.linear()
          .range([0, dimension.width]);

      var y = d3.scale.linear()
          .range([dimension.height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .tickSize(0)
          .tickPadding(10)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.game); })
          .y(function(d) { return y(d.value); });


      x.domain(d3.extent(data[0].trend, function(d) { return d.game; }));

      y.domain([0,
        d3.max(data, function(d) {
          return d3.max(d.trend, function(c) {
            return c.value
          });
        })
      ]);

      svg.append("g")
          .attr("class", "line-chart x axis")
          .attr("transform", "translate("+position.x+"," + (dimension.height + position.y) + ")")
          .call(xAxis);

      svg.selectAll('.line-chart .tick')
        .filter(function(d) {return d === 0})
        .remove()

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+position.x+"," + position.y + ")")
          .call(yAxis)

        .append("text")
          .attr('transform', 'translate(0, -30)')
          .attr("dy", ".71em")
          .style("text-anchor", "start")
          .text("Score over time");

      var player = svg.selectAll(".player-line")
         .data(data)
       .enter().append("g")
         .attr("class", "player-line")
         .attr("transform", "translate("+position.x+"," + (position.y) + ")");

      player.append("path")
         .attr("class", "line")
         .attr("d", function(d) { return line(d.trend); })
         .attr('opacity', 0.9)
         .style("stroke", function(d) { return color(d.name); });

     player.append("text")
         .datum(function(d) { return {name: d.name, value: d.trend[d.trend.length - 1]}; })
         .attr('class', 'line-label')
         .attr("transform", function(d) { return "translate(" + x(d.value.game) + "," + y(d.value.value) + ")"; })
         .attr("x", 3)
         .attr("dy", ".35em")
         .text(function(d) { return d.name + " ("+d.value.value+")"; });

    }

    var updateLineChart = function(svg,data, dimension, labels) {

      if(!labels) {
        labels = {
          title:'N/A',
          lineClass: 'lines',
          labelClass: 'labels'
        }
      }

      if(!dimension) {
        dimension = {
          height: 130,
          width: 660
        }
      }

      var x = d3.scale.linear()
          .range([0, dimension.width]);

      var y = d3.scale.linear()
          .range([dimension.height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .tickSize(0)
          .tickPadding(10)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.game); })
          .y(function(d) { return y(d.value); });

      x.domain(d3.extent(data[0].trend, function(d) { return d.game; }));

      y.domain([0,
        d3.max(data, function(d) {
          return d3.max(d.trend, function(c) {
            return c.value
          });
        })
      ]);

      svg.selectAll('.line-chart.x.axis').call(xAxis);

      var lines = svg.selectAll(".player-line .line").data(data);

      lines.transition().duration(1500).attr("d", function(d) {return line(d.trend); })

      var labels = svg.selectAll('.line-label').data(data)

      labels
        .datum(function(d) { return {name: d.name, value: d.trend[d.trend.length - 1]}; })
        .transition().duration(1500)
        .attr("transform", function(d) { return "translate(" + x(d.value.game) + "," + y(d.value.value) + ")"; })
        .text(function(d) { return d.name + " ("+d.value.value+")"; });

    }
