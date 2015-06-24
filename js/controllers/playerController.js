app.controller('playerController', ['$scope', function($scope) {
  $scope.players = [
    {
      name: 'Rob',
      score1: 0,
      score2: 0,
      score3: 0,
      score: 0,
      plusOne: function() {
        console.log(this.score1);
        this.score1 += 1;
      }
    },
    {
      name: 'Ben',
      score1: 0,
      score2: 0,
      score3: 0,
    },
    {
      name: 'Will',
      score1: 0,
      score2: 0,
      score3: 0,
    }
  ];

  $scope.players.forEach(function(player) {
    player.plusOne = function() {
      this.score1 += 1;
    };
    player.minusOne = function() {
      if (this.score1 > 0) this.score1 -= 1;
    }
  })
}]);
