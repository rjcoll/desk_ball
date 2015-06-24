app.controller('playerController', ['$scope', function($scope) {
  $scope.players = [
    {
      name: 'Rob'
    },
    {
      name: 'Ben'
    },
    {
      name: 'Will'
    }
  ];

  $scope.players.forEach(function(player) {
    player.score1 = 0;
    player.score2 = 0;
    player.score3 = 0;
    player.score = 0;

    player.plusOne = function() {
      var stage = "score" + $scope.stage;
      if (this[stage] >=3 ) $scope.stage += 1;
       else this[stage] += 1;
    };
    player.minusOne = function() {
      var stage = "score" + $scope.stage;
      if (this[stage] > 0) this[stage] -= 1;
        //else if ($scope.stage > 1)  $scope.stage -= 1;
    }
  });

    $scope.stage = 1;

    $scope.nextStage = function() {
      if ($scope.stage < 4) $scope.stage += 1;
    }

    $scope.nextStage = function() {
      if ($scope.stage > 1) $scope.stage -= 1;
    }


}]);
