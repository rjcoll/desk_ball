app.controller('gameController', ['$scope', 'Person', 'playerService', function($scope, Person, playerService) {

  /* === PLAYERS === */

  /* Define the players */
  $scope.playerService = playerService;

  $scope.players =[{},{},{}]

  //create the empty schema for the game
  $scope.players.forEach(function(player, index) {
    player.name = playerService.p[index]
    player.score1 = 0;
    player.score2 = 0;
    player.score3 = 0;
    player.score4 = 0;
    player.score5 = 0;
    player.score = 0;
    player.updateScore = function() {
      var array = [this.score1, this.score2, this.score3, this.score4, this.score5];
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

  /* === ROUNDS === */

  //init
  $scope.stage = 0;

  $scope.rounds = ["Round 1", "Round 2", "Round 3", "Tiebreaker", "Final"];

  // helpers
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


  /* === GAME === */

  //init
  $scope.tie = false;
  $scope.head = false;
  $scope.end = false;

  //sort out where we are in the game
  game = function() {

    //is it a tie?
    if ($scope.players[0].score === 1 &&
        $scope.players[1].score === 1 &&
        $scope.players[2].score === 1
      ) {
        $scope.stage = 3;
        return $scope.tie = true;
    }

    //is it the final?
    if (
        ($scope.players[0].score > 1 ||
        $scope.players[1].score > 1 ||
        $scope.players[2].score > 1)
        &&
        ($scope.players[0].score +
          $scope.players[1].score +
          $scope.players[2].score) >=3 &&
          !$scope.head
      ) {
        $scope.stage = 4;
        return $scope.head = true;
    }

    //is it it the end?
    if ($scope.head && ($scope.players[0].score5 > 2 || $scope.players[1].score5 > 2 || $scope.players[2].score5 > 2) ) {
      //set the end of the game
      $scope.end = true;
    }

    if ($scope.end) {

      //count the players scores for the first 3 rounds (and the tiebreaker)//
      $scope.players.forEach(function(player) {
        var count = 0
        for (var i=1; i<5; i++) {
          if (player['score' + i] === 3) count++
        }

        //find the loser, if they've lost more than one round
        if (count > 1) {
          $scope.loser = player.name;
          player.place = 'loser';
        }

        // else
        else {
          //if a player has lost the final, make them the middle
          if (player.score5 === 3) {
            $scope.middle = player.name;
            player.place = 'middle';
          }
          // or make them the winner if not
          else {
            $scope.winner = player.name;
            player.place = 'winner';
          }

        }

      })
    }
  }

  addGame = function(players) {

    var scores = [];

        var names = playerService.p

    /*Create Schema for each player*/
    players.forEach(function(player, index) {
      var score = {
        name: names[index],
        score: player.score,
        score1: player.score1,
        score2: player.score2,
        score3: player.score3,
        score4: player.score4,
        score5: player.score5,
        place: player.place
      };

      scores.push(score);
    });

    var game = {
      tie: $scope.tie,
      winner: $scope.winner,
      middle: $scope.middle,
      loser: $scope.loser
    }

    var save = {
      game: game,
      scores: scores,
      dateTime: Date.now()
    }

    return save
  }

  $scope.add = function() {

    if (!$scope.end) return alert('Not the end of the game!')

    var save = addGame($scope.players)

    save = Person.$add(save);

    /*reset the player scope if the save is successful*/
     if(save) {

      $scope.players.forEach(function(player) {
        player.score1 = 0;
        player.score2 = 0;
        player.score3 = 0;
        player.score4 = 0;
        player.score5 = 0;
        player.score = 0;
        player.tie = false;
        player.head = false;
        player.place = '';
      })

      $scope.tie = false;
      $scope.head = false;

      $scope.stage = 0;


     } else {
      alert('Something went wrong');
     }
    }

}]);
