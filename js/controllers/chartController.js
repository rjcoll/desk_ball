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


      //after charts are drawn, define watch event
      Person.$watch(function(event) {
        //update chart
        var data = calcScores();

        for (var i=0; i<charts.length; i++) {

          label = charts[i].label;

          data.forEach(function(d) {
            d.value = d[charts[i].value];
          })

          update_chart(data, null, label);
        }

      });
    })

    var update_chart = function(data, dimension, labels) {

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
      if (!data) return;

      if (!position) return;

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
      yScale = d3.scale.linear()
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

    var calcScores = function() {
      var data = [
        {name: "Rob", score: 0, loss: 0, round1: 0, round2:0, round3: 0},
        {name: "Ben", score: 0, loss: 0, round1: 0, round2:0, round3: 0},
        {name: "Will", score: 0, loss: 0, round1: 0, round2:0, round3: 0},
      ]

      Person.forEach(function(game) {
        var winner = game.game.winner;
        var loser = game.game.loser;
        for (var i = 0; i < game.scores.length; i++) {
          var player = game.scores[i].name

          if (data[i]['name'] == winner) {
              data[i]['score']++;
          }
          else if (data[i]['name'] == loser) {
              data[i]['loss']++;
          }

          for (var j=0;j<data.length; j++) {
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


        }
      })

      return data;

    }
  }]);
