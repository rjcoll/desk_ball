app.controller('playerController', ['$scope', 'Person', function($scope, Person) {
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
    player.score4 = 0;
    player.score5 = 0;
    player.score = 0;
    player.tie = false;
    player.head = false;
    player.updateScore = function() {
      var array = [this.score1, this.score2, this.score3, this.score4];
      var count = 0;
      for(var i = 0; i < array.length; i++) {
        if (array[i] === 3) count++
      }
      player.score = count;
      game();
    };

    player.plusOne = function() {
      var stage = "score" + ($scope.stage + 1);
      if (this[stage] < 3) this[stage] += 1;
      if (this[stage] >= 3 && $scope.stage < 4) $scope.nextStage();
      this.updateScore();
    };
    player.minusOne = function() {
      var stage = "score" + ($scope.stage + 1);
      if (this[stage] > 0) this[stage] -= 1;
      this.updateScore();
        //else if ($scope.stage > 1)  $scope.stage -= 1;
    };

    player.roundScore = function(round) {
      if (round === $scope.stage) return 'cur-round'
    }
  });

  $scope.rounds = ["Round 1", "Round 2", "Round 3", "Tiebreaker", "Final"]

  $scope.stage = 0;

  $scope.round = function(stage) {return $scope.rounds[stage]}

  $scope.nextStage = function() {
    if ($scope.stage < 4) $scope.stage += 1;
    if ($scope.stage === 3 & !$scope.tie) $scope.stage = 4;
    if ($scope.stage === 4 & !$scope.head) $scope.stage = 2;
  }

  $scope.prevStage = function() {
    if ($scope.stage > 0) $scope.stage -= 1;
    if ($scope.stage === 3 & !$scope.tie) $scope.stage = 2;
  }

  $scope.tie = false;
  $scope.head = false;

  game = function() {
    if ($scope.players[0].score === 1 && $scope.players[1].score === 1 && $scope.players[2].score === 1) {
      console.log('tie');
      $scope.stage = 3;
      for (var i = 0; i < 3; i++) {
        $scope.players[i].tie = true;
      }
      return $scope.tie = true;
    }

    if (($scope.players[0].score > 1 || $scope.players[1].score > 1 || $scope.players[2].score > 1) && ($scope.players[0].score + $scope.players[1].score + $scope.players[2].score) >=3  ) {
      $scope.stage = 4;
      for (var i = 0; i < 3; i++) {
        $scope.players[i].head = true;
      }
      return $scope.head = true;
      }
  }

  $scope.list = Person;

  $scope.add = function() {

    var scores = [];

    $scope.players.forEach(function(player) {
      var score = {
        name: player.name,
        score: player.score,
        score1: player.score1,
        score2: player.score2,
        score3: player.score3,
        score4: player.score4,
        score5: player.score5
      };

      scores.push(score);
    });

     var save = Person.$add({
      scores: scores,
      dateTime: Date.now()
     });

     if(save) {
      alert('saved successfully');
      $scope.players.forEach(function(player) {
        player.score1 = 0;
        player.score2 = 0;
        player.score3 = 0;
        player.score4 = 0;
        player.score5 = 0;
        player.score = 0;
        player.tie = false;
        player.head = false;
      })

      $scope.tie = false;
      $scope.head = false;

      $scope.stage = 0;


     } else {
      alert('something went wrong');
     }
    }

}]);
