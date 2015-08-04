app.controller('chartController', ['$scope', 'Person', function($scope, Person) {
  var controller = angular.element('[ng-controller="chartController"]');


  var svg = d3.select('[ng-controller="chartController"] .container')
    .append('svg')
    .attr('height', (400))
    .style('width', '100%');

  // Browser onresize event
  window.onresize = function() {
    $scope.$apply();
  };

  // hard-code data
  $scope.data = Person;

  //define charts

  var charts = [
    {
      name: 'Wins',
      label: {
        title: 'Wins',
        barClass: 'win-bars',
        labelClass: 'win-labels'
      },
      value: 'score'
    },
    {
      name: 'Losses',
      label: {
        title: 'Losses',
        barClass: 'loss-bars',
        labelClass: 'loss-labels'
      },
      value: 'loss'
    },
    {
      name: 'Round 1 losses',
      label: {
        title: 'Round 1 losses',
        barClass: 'r1-bars',
        labelClass: 'r1-labels'
      },
      value: 'round1'
    },
    {
      name: 'Round 2 losses',
      label: {
        title: 'Round 2 losses',
        barClass: 'r2-bars',
        labelClass: 'r2-labels'
      },
      value: 'round2'
    },
    {
      name: 'Round 3 losses',
      label: {
        title: 'Round 3 losses',
        barClass: 'r3-bars',
        labelClass: 'r3-labels'
      },
      value: 'round3'
    }

  ]

  Person.$loaded()
    .then(function(x) {
      var data = calcScores();

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

        data.forEach(function(d) {
          d.value = d[charts[i].value];
        })

        drawBarChart(data, null, null, position, label)
      }

      position.x = 0;
      position.y = 230;

      drawLineChart(data, null, null, position, null)


      //after charts are drawn, define watch event
      Person.$watch(function(event) {
        //update chart
        var data = calcScores();

        updateLineChart(data, null, null);

        for (var i=0; i<charts.length; i++) {

          label = charts[i].label;

          data.forEach(function(d) {
            d.value = d[charts[i].value];
          })

          updateBarChart(data, null, label);


        }

      });
    })

    var updateBarChart = function(data, dimension, labels) {

      if(!dimension) {
        dimension = {
          height: 100,
          width: 100
        }
      }

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return Math.max(d.score, d.loss, d.round1, d.round2, d.round3);
        })])
        .range([dimension.height, 0]);


      var bars = d3.selectAll('.' + labels.barClass);

      bars.data(data).transition().delay(100).duration(750)
        .attr("y", function(d) { return yScale(d.value) })
        .attr("height", function(d) { return 100 - yScale(d.value); })


      var labels = d3.selectAll('.' + labels.labelClass);

      labels.data(data).transition().delay(100).duration(750)
        .attr("y", function(d) { return yScale(d.value) - 5; })
        .text(function(d) {return d.value});

    }

    var drawBarChart = function(data, margin, dimension, position, labels) {
      if (!data || !position) return;

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

      var color = d3.scale.category20(),

          xScale = d3.scale.ordinal()
            .rangeRoundBands([0, 100], .1);

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
        .attr("class", "x axis")
        .attr("transform", "translate("+ (margin.left + position.x) +"," + (dimension.height + margin.top + 20) + ")")
        .call(xAxis);

    }

    var drawLineChart = function(data, margin, dimension, position, labels) {
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

    var updateLineChart = function(data, dimension, labels) {

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

      svg.selectAll('.line-chart .x.axis').call(xAxis);

      var lines = svg.selectAll(".player-line .line").data(data);

      lines.transition().duration(1500).attr("d", function(d) {return line(d.trend); })

      var labels = svg.selectAll('.line-label').data(data)

      labels
        .datum(function(d) { return {name: d.name, value: d.trend[d.trend.length - 1]}; })
        .transition().duration(1500)
        .attr("transform", function(d) { return "translate(" + x(d.value.game) + "," + y(d.value.value) + ")"; })
        .text(function(d) { return d.name + " ("+d.value.value+")"; });


    }

    var calcScores = function() {
      var data = [
        {name: "Rob", score: 0, loss: 0, round1: 0, round2:0, round3: 0, trend: [{game: 0, value: 0}]},
        {name: "Ben", score: 0, loss: 0, round1: 0, round2:0, round3: 0, trend: [{game: 0, value: 0}]},
        {name: "Will", score: 0, loss: 0, round1: 0, round2:0, round3: 0, trend: [{game: 0, value: 0}]},
      ]

      var trendScore = [0,0,0]

      Person.forEach(function(game, index) {
        var winner = game.game.winner,
            loser = game.game.loser

        //iterate through all of the players (there might be more than three)
        for (var j=0;j<data.length; j++) {

          //assign the winner and the loser scores
          if (data[j]['name'] == winner) {
              data[j]['score']++;
              trendScore[j]++;

          }
          else if (data[j]['name'] == loser) {
              data[j]['loss']++;
          }

          //for each score in the game
          for (var i = 0; i < game.scores.length; i++) {

            //find the player
            var player = game.scores[i].name

            //update the players scores
            if (data[j].name == player) {
              if (game.scores[i].score1 === 3) {
                data[j].round1 += 1
              }
              if (game.scores[i].score2 === 3) {
                data[j].round2 += 1
              }
              if (game.scores[i].score3 === 3) {
                data[j].round3 += 1
              }
            }
          }

          data[j].trend.push({game: (index+1), value: trendScore[j]})

        }
      })

      return data;

    }
  }]);
