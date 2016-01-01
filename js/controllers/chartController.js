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
    var players = playerService.p;
    updateCharts(svg, charts, Person, players);
  }

  $scope.sortType = 'name'; // set the default sort type
  $scope.sortReverse = false;  // set the default sort order

  players = playerService.p

  Person.$loaded()
    .then(function(x) {
      drawCharts(svg,charts,Person,players)
      $scope.ranking = scoreBoard(Person);



      //after charts are drawn, define watch event
      Person.$watch(function(event) {
        players = playerService.p
        updateCharts(svg, charts, Person, players)
        //update charts when the database changes
        $scope.ranking = scoreBoard(Person);
        }
      );
    });
  }]);
