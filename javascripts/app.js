// Setting game global variable ----------------------------------

var counter = 1;
var hoverCheck = false;
var gameRounds = 5;
var timerCountSet = 10;
var timerId = null;
var gridSize = 3;
var gameFinished = false;
var colors = {left1:"rgba(250,30,30,0.6) 0%",left2:"rgba(30,30,200,0.6) 0.5%", right2:"rgba(30,30,200,0.6) 5%",right1:"rgba(30,30,250,0.6) 100%"};
var tween = TweenLite.to(colors, 0.5, {colorProps:{left1:"rgba(250,30,30,0.6) 0%",left2:"rgba(200,30,30,0.6) 95%", right2:"rgba(200,30,30,0.6) 99.5%",right1:"rgba(30,30,250,0.6) 100%"}, onUpdate:colorize, onUpdateParams:["#slide-4"], paused:true});
var p2SummonCat = true;
var p1SummonCat = true;
var p2TimerReduce = true;
var p1TimerReduce = true;
var p2SummonCatActive = false;
var p1SummonCatActive = false;
var p2TimerReduceActive = false;
var p1TimerReduceActive = false;

// creating the object element - board, game, turn, player1 & player 2 -----
var board = {
  sizeX: gridSize,
  sizeY: gridSize,
  drawBoard: function(){
    for(var i=0;i<board.sizeY;i++){
      $(".game-container").append("<div class='row-box' id='row-"+i+"'>");
      for(var j=0;j<board.sizeX;j++){
        $("#row-"+i).append("<div class='box'><span class='cell-box' id='box-"+i+"-"+j+"'></span></div>");
        $(".row-box").css('height',100/board.sizeX+"%");
        $(".cell-box").css('fontSize',15/board.sizeX+"em");
        if(i === 0){
          $("#box-"+i+"-"+j).parent().addClass('outer-top');
        }
        if(i === board.sizeY-1){
          $("#box-"+i+"-"+j).parent().addClass('outer-bottom');
        }
        if(j === 0){
          $("#box-"+i+"-"+j).parent().addClass('outer-left');
        }
        if(j === board.sizeX-1){
          $("#box-"+i+"-"+j).parent().addClass('outer-right');
        }
      }
    }
  },
  clearBoard: function(){
    $('.box').remove();
    $('.row-box').remove();
  }

};


var game = {
  status: 'game',
  numRounds: gameRounds,
  roundCount: 1,
  init: function(){
    game.status = "game";
    game.roundCount = 1;
    player1.win = 0;
    player2.win = 0;
    turn.count = 1;
    turn.timeCount();
    board.drawBoard();
    game.updateDisplay();
    game.updateRoundDisplay();
    currentPlayer = turn.player();
    currentPlayer.backgroundSlide();
    $("#p1WinCount").html(player1.win);
    $("#p2WinCount").html(player2.win);
  },

  reset: function(){
    board.clearBoard();
    clearInterval(timerId);
    timerId = null;
    game.init();
    gameFinished = false;
    p2SummonCat = true;
    p1SummonCat = true;
    p2TimerReduce = true;
    p1TimerReduce = true;
    $p1SkillCat.css("opacity","1");
    $p2SkillCat.css("opacity","1");
    $p1SkillTimer.css("opacity","1");
    $p2SkillTimer.css("opacity","1");
  },

  nextRound: function(){
    game.roundCount+=1;
    game.status = "game";
    turn.count = 1;
    board.clearBoard();
    board.drawBoard();
    game.updateDisplay();
    game.updateRoundDisplay();
    clearInterval(timerId);
    timerId = null;
    turn.timeCount();
  },

  getData: function(){
    var array = [];
    for(var i=0;i<board.sizeY;i++){
      var innerArray = []
      for(var j=0;j<board.sizeX;j++){
        innerArray = innerArray.concat($("#box-"+i+"-"+j).html());
      }
      array[i] = innerArray;
    }
    return array;
  },

  updateDisplay: function(){
    currentPlayer = turn.player();
    otherPlayer = turn.other_player();
    $("#player-turn").html(turn.player().character)
    $("#p1WinCount").html(player1.win);
    $("#p2WinCount").html(player2.win);
    otherPlayer.menu.fadeOut();
    currentPlayer.menu.fadeIn();

  },
  
  updateRoundDisplay: function(){
    if(game.roundCount < game.numRounds){
      $('#roundCount').html("X VS O : Round "+game.roundCount+" of "+game.numRounds);
    } else if (game.roundCount === game.numRounds){
      $('#roundCount').html("X VS O : FINAL ROUND!!!");
    }
    
  },

  checkGameCondition: function(){
    if(game.roundCount === game.numRounds && player1.win > player2.win){
      $('#roundCount').html("X WINS!!");
      $("#nextRoundBtn").fadeOut();
      gameFinished = true;
    } else if (game.roundCount === game.numRounds && player1.win < player2.win){
      $('#roundCount').html("O WINS!!");
      $("#nextRoundBtn").fadeOut();
      gameFinished = true;
    } else if (game.roundCount === game.numRounds && player1.win === player2.win){
      $('#roundCount').html("NO ONE WINS. IT'S A TIE!");
      $("#nextRoundBtn").fadeOut();
      gameFinished = true;
    }
  }
};

var turn = {
  count: 1,
  timerCountSet: timerCountSet,
  player: function(){
    if(turn.count %2 === 0){
      return player2;
    } else{
      return player1;
    }
  },
  execute: function(){
    if (checkWinCondition(game.getData(), turn.other_player().character)){
      turn.doWin();
      game.checkGameCondition();
    }else if (checkTieCondition(game.getData())){
      $("#player-turn").html("The game is a tie!");
      game.status = "tie";
      game.checkGameCondition();
    } else {
      turn.next();
    }
  },

  doWin: function(){
    $("#player-turn").html(turn.player().character + " WIN!!");
    TweenMax.to($(".cell-box"),0.5,{opacity:0.2});
    TweenMax.staggerTo(checkWinCondition(game.getData(), turn.other_player().character)[1], 0.5, {css:{ fontSize: "+=1em" , opacity:1}, delay:0.2, ease:Elastic.easeIn, force3D:true}, 0.5);
    $(this).off('click');
    game.status = "win";
    clearInterval(timerId);
    timerId = null;
    turn.player().win += 1;
    $("#p1WinCount").html(player1.win);
    $("#p2WinCount").html(player2.win);
  },

  other_player: function(){
    if(turn.count %2 === 0){
      return player1;
    } else{
      return player2;
    }
  },

  next: function(){
    turn.count += 1;
    game.updateDisplay();
    clearInterval(timerId);
    timerId = null;
    turn.timeCount();
    currentPlayer = turn.player();
    currentPlayer.backgroundSlide();
  },

  timeCount: function(){
    if(timerId === null){
      timerCount = turn.timerCountSet;
      timerId = setInterval(function(){
        if (timerCount < 1){
          clearInterval(timerId);
          timerId = null;
          deactivateAbilities();
          turn.next();
        }
        $("#timer").html(timerCount);
        timerCount-= 1;
      },1000);
    }
  }
}

var player1 = {
  character: 'X',
  color: 'black',
  win: 0,
  menu: '',
  storeTimer: timerCountSet,
  backgroundSlide: function(){
    tween.play();
  },
  abilitiesOff: function(){
    stopCat1Walk()
    $("#cat1").fadeOut();
    $(".box").css('opacity',1);
  },
  summonCat: function(){
    deactivateAbilities();
    p1SummonCatActive = true;
    $("#cat2").fadeIn();
    startCat2Walk();
    $(".box").css('opacity',0.2);
    turn.next();
  },
  reduceTimer: function(){
    turn.timerCountSet = 3;
    p1TimerReduceActive = true;
    turn.next();
  }

};

var player2 = {
  character: 'O',
  color: 'white',
  win: 0,
  menu: '',
  storeTimer: timerCountSet,
  backgroundSlide: function(){
    tween.reverse();
  },
  abilitiesOff: function(){
    stopCat2Walk()
    $("#cat2").fadeOut();
    $(".box").css('opacity',1);
  },
  summonCat: function(){
    deactivateAbilities();
    p2SummonCatActive = true;
    $("#cat1").fadeIn();
    startCat1Walk();
    $(".box").css('opacity',0.2);
    turn.next();
  },
  reduceTimer: function(){
    turn.timerCountSet = 3;
    p2TimerReduceActive = true;
    turn.next();
  }
  
};

// helper functions ------------------------------------------------

// ** helper function to check winning condition 
function checkRows(array,other_character){
  var resultArray = [];
  for(var i=0;i<array.length;i++){
    var innerArray = [[],[]];
    for(var j=0;j<array.length;j++){
      innerArray[0] = innerArray[0].concat(array[i][j]);
      innerArray[1] = innerArray[1].concat("#box-"+i+"-"+j);
    }
    if (innerArray[0].indexOf('') === -1 && innerArray[0].indexOf(other_character) === -1){
      return resultArray = [true, innerArray[1]];
    }
  }
};

function checkColumns(array,other_character){
  var resultArray = [];
  for(var i=0;i<array.length;i++){
    var innerArray = [[],[]];
    for(var j=0;j<array.length;j++){
      innerArray[0] = innerArray[0].concat(array[j][i]);
      innerArray[1] = innerArray[1].concat("#box-"+j+"-"+i);
    }
    if (innerArray[0].indexOf('') === -1 && innerArray[0].indexOf(other_character) === -1){
      return resultArray = [true, innerArray[1]];
    }
  }
};

function checkDiagonalRight(array,other_character){
  var innerArray = [[],[]];
  for(var i=0;i<array.length;i++){
    innerArray[0] = innerArray[0].concat(array[i][i]);
    innerArray[1] = innerArray[1].concat("#box-"+i+"-"+i);
  }
  if (innerArray[0].indexOf('') === -1 && innerArray[0].indexOf(other_character) === -1){
    return resultArray = [true, innerArray[1]];
  }
};

function checkDiagonalLeft(array,other_character){
  var innerArray = [[],[]];
  for(var i=array.length-1;i>=0;i--){
    innerVar = Math.abs(i - array.length+1);
    innerArray[0] = innerArray[0].concat(array[innerVar][i]);
    innerArray[1] = innerArray[1].concat("#box-"+innerVar+"-"+i);
  }
  if (innerArray[0].indexOf('') === -1 && innerArray[0].indexOf(other_character) === -1){
    return resultArray = [true, innerArray[1]];
  }
};

function checkTieCondition(array){
  var resultArray = [];
  for(var i=0;i<array.length;i++){
    resultArray[i] = [];
    for(var j=0;j<array.length;j++){
      resultArray[i] = resultArray[i].concat(array[i][j]);
    }
  }
  if(_.indexOf(_.flatten(resultArray),'') === -1){
    return true;
  }
};

function checkWinCondition(array,other_character){
  return (checkRows(array,other_character) || checkColumns(array,other_character) || checkDiagonalLeft(array,other_character) || checkDiagonalRight(array,other_character));
}

// ** in-game helper function

function menuBtnListener(){
  $("#grid-decrease").on('click',function(){
    if(gridSize > 3){
      $("#gridSize").html(gridSize-1);
      gridSize -=1;
    }
  });

  $("#grid-increase").on('click',function(){
    if(gridSize < 7){
      $("#gridSize").html(gridSize+1);
      gridSize +=1;
    }
  });

  $("#round-decrease").on('click',function(){
    if(gameRounds > 3){
      $("#roundNum").html(gameRounds-1);
      gameRounds -=1;
    }
  });

  $("#round-increase").on('click',function(){
    if(gameRounds < 7){
      $("#roundNum").html(gameRounds+1);
      gameRounds +=1;
    }
  });

  $("#timer-decrease").on('click',function(){
    if(timerCountSet > 3){
      $("#timerNum").html(timerCountSet-1);
      timerCountSet -=1;
    }
  });

  $("#timer-increase").on('click',function(){
    if(timerCountSet < 20){
      $("#timerNum").html(timerCountSet+1);
      timerCountSet +=1;
    }
  });
}

function deactivateAbilities(){
  currentPlayer = turn.player();
  otherPlayer = turn.other_player();
  if (p1SummonCatActive || p2SummonCatActive|| p1TimerReduceActive|| p2TimerReduceActive){
    resetTimer(otherPlayer.storeTimer);
    currentPlayer.abilitiesOff();
    p2SummonCatActive = false;
    p1SummonCatActive = false;
    p1TimerReduceActive = false;
    p2TimerReduceActive = false;
  }
}

function resetTimer(time){
  turn.timerCountSet = time;
}

// ** helper function for the slide animation transition
function slideAnimation(){
  // Setting animation initial DOM variable
  $window = $(window);
  $document = $(document);
  //Only links that starts with #
  $navButtons = $("nav a").filter("[href^=#]");
  $navGoPrev = $(".go-prev");
  $navGoNext = $(".go-next");
  $navGoLast = $(".go-last");
  $slidesContainer = $(".slides-container");
  $slides = $(".slide");
  $currentSlide = $slides.first();
  $lastSlide = $("#slide-4");

  //Animating flag - is our app animating
  isAnimating = false;

  //The height of the window
  pageHeight = $window.innerHeight();

  //Going to the first slide
  goToSlide($currentSlide);

  //Adding slide animation event listeners

  $window.on("resize", onResize).resize();
  $navButtons.on("click", onNavButtonClick);
  $navGoPrev.on("click", goToPrevSlide);
  $navGoNext.on("click", goToNextSlide);
  $window.on("mousewheel DOMMouseScroll", onMouseWheel);
  $document.on("keydown", onKeyDown);
  $navGoLast.on("click", function(){
    goToLastSlide();
    board.sizeX = gridSize;
    board.sizeY = gridSize;
    game.numRounds = gameRounds;
    turn.timerCountSet = timerCountSet;
    player1.timerCountSet = timerCountSet;
    player2.timerCountSet = timerCountSet;
    player1.menu = $("#p1Menu");
    player2.menu = $("#p2Menu");
    game.init();
  });
}

// ** Background animation helper function
function colorize(element) {
  //apply the colors to the element
  TweenLite.set(element, {backgroundImage:"linear-gradient(to right," + colors.left1 + ", " + colors.left2 + ", " + colors.right2+ ", " + colors.right1 + ")"});
}

// document finished loading -------------------------------------
$(document).ready(function(){
  gridSize = parseInt($("#gridSize").html());
  gameRounds = parseInt($("#roundNum").html());
  timerCountSet = parseInt($("#timerNum").html());
  $p1SkillCat = $("#p1Skill1");
  $p1SkillTimer = $("#p1Skill2");
  $p2SkillCat = $("#p2Skill1");
  $p2SkillTimer = $("#p2Skill2");

  $p1SkillCat.on('click',function(){
    if(p1SummonCat){
      player1.summonCat();
      p1SummonCat = false;
      $p1SkillCat.css("opacity","0.2");
    }
  });

  $p2SkillCat.on('click',function(){
    if(p2SummonCat){
      player2.summonCat();
      p2SummonCat = false;
      $p2SkillCat.css("opacity","0.2");
    }
  });

  $p1SkillTimer.on('click',function(){
    if(p1TimerReduce){
      deactivateAbilities();
      player1.reduceTimer();
      p1TimerReduce = false;
      $p1SkillTimer.css("opacity","0.2");
    }
  });

  $p2SkillTimer.on('click',function(){
    if(p2TimerReduce){
      deactivateAbilities();
      player2.reduceTimer();
      p2TimerReduce = false;
      $p2SkillTimer.css("opacity","0.2");
    }
  });


  $('.game-container').on('mouseenter','.row-box > div', function(){
    if ($(this).find('span').html() === ''){
      $(this).find('span').addClass('blur').html(turn.player().character);
      hoverCheck = true;
    }
  });

  $('.game-container').on('mouseleave','.row-box > div', function(){
    if(hoverCheck){
      $(this).find('span').removeClass('blur').html('');
      hoverCheck = false;
    }
  });

  $('.game-container').on('click','.row-box > div', function(){
    if(hoverCheck && game.status === 'game' && !gameFinished){
      deactivateAbilities();
      $(this).find('span').removeClass('blur').html(turn.player().character);
      TweenLite.from($(this),1,{opacity:0});
      TweenLite.to($(this),1,{css:{color:turn.player().color}});
      hoverCheck = false;
      turn.execute();
    }
  });

  $("#resetBtn").on('click',function(){
    deactivateAbilities();
    game.reset();
    $("#nextRoundBtn").fadeIn();
  });

  $("#nextRoundBtn").on('click',function(){
    if(game.status === 'game'){
      turn.other_player().win +=1;
    }
    deactivateAbilities();
    game.checkGameCondition();
    game.nextRound();

  });

  // Set the animation and transition event handlers. See slide-animation.js for detail of functions.
  slideAnimation();

  // listen to all the buttons in the game menu
  menuBtnListener()
  
});

