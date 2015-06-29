app.controller('chartController', ['$scope', 'Person', function($scope, Person) {
  var controller = angular.element('[ng-controller="chartController"]');


  var svg = d3.select('[ng-controller="chartController"] .container')
    .append('svg')
    .style('width', '100%');

  // Browser onresize event
  window.onresize = function() {
    $scope.$apply();
  };

  // hard-code data
  $scope.data = Person;

  Person.$loaded()
    .then(function(x) {
      var data = [
            {name: "Rob", score: 0},
            {name: "Ben", score: 0},
            {name: 'Will', score: 0}
          ]

      Person.forEach(function(game) {
        var winner = game.game.winner;
        for (var i = 0; i < data.length; i++) {
          if (data[i]['name'] == winner) {
              return data[i]['score']++;
          }
        }

        //data[winner].score += 1;
      })
      $scope.render(data);

      Person.$watch(function(event) {
        //update chart
        var data = [
              {name: "Rob", score: 0},
              {name: "Ben", score: 0},
              {name: 'Will', score: 0}
            ]

        Person.forEach(function(game) {
          var winner = game.game.winner;
          for (var i = 0; i < data.length; i++) {
            if (data[i]['name'] == winner) {
                return data[i]['score']++;
            }
          }

          //data[winner].score += 1;
        })
        update_chart(data);
      });
    })


  // Watch for resize event


          $scope.render = function(data) {
            // our custom d3 code
            // remove all previous items before render

            var margin = 25,
            barWidth = 20,
            svgHeight = 150,
            barPadding = 5;

            // If we don't pass any data, return out of the element
            if (!data) return;

            // setup variables
            var width = 100,
                // calculate the height
                height = 100,
                // Use the category20() scale function for multicolor support
                color = d3.scale.category20(),

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
                    return d.score;
                  })])
                  .range([height, 0]);

            // set the height based on the calculations above
            svg.attr('height', svgHeight);

            var chart = svg
              .append('g')
              .attr('transform', "translate(" + margin + "," + margin + ")")

            var bar = chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("transform", function(d) { return "translate(" + xScale(d.name) + ",0)"; });

            //create the rectangles for the bar chart
            bar.append('rect')
              .attr('class', 'score-bar')
              .attr("y", function(d) { return yScale(d.score) })
              .attr("height", function(d) { return height - yScale(d.score); })
              .attr("width", xScale.rangeBand())
                .attr('fill', function(d) { return color(d.name); })


            bar.append('text')
              .attr('class', 'score-text')
              .attr("y", function(d) { return yScale(d.score) - 5; })
              .attr('x', xScale.rangeBand()/2)
              .attr('text-anchor', 'middle')
              .text(function(d) {return d.score})

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate("+ margin +"," + (height + margin) + ")")
              .call(xAxis);
        };

        var update_chart = function(data) {

          var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.score;
            })])
            .range([100, 0]);


          var bars = d3.selectAll('.score-bar');

          bars.data(data).transition().delay(100).duration(750)
            .attr("y", function(d) { return yScale(d.score) })
            .attr("height", function(d) { return 100 - yScale(d.score); })

          var labels = d3.selectAll('.score-text');

          labels.data(data).transition().delay(100).duration(750)
            .attr("y", function(d) { return yScale(d.score) - 5; })
            .text(function(d) {return d.score})

        }
  }]);
