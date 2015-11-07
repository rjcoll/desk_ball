app.controller('chartController', ['$scope', 'Person', 'playerService', function($scope, Person, playerService) {

  var svg = d3.select('[ng-controller="chartController"] .container')
    .append('svg')
    .attr('height', (400))
    .style('width', '100%');


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

  $scope.update = function() {
    players = [playerService.value0,playerService.value1,playerService.value2]
    updateCharts(svg, charts, Person, players)
  }

  players = [playerService.value0,playerService.value1,playerService.value2]

  Person.$loaded()
    .then(function(x) {
      drawCharts(svg,charts,Person,players)


      //after charts are drawn, define watch event
      Person.$watch(function(event) {
        players = [playerService.value0,playerService.value1,playerService.value2]
        updateCharts(svg, charts, Person, players)
        //update charts when the database changes
        }

      );
    });

      //define watch event on players too

  }]);
