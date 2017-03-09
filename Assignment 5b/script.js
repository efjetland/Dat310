
$(document).ready(function(){

  function clock(element){
    this.minute = 0;
    this.second = 0;
    this.e = element;
    this.e.text('00:00');
    this.update = function(){
      this.second++;
      if(this.second === 60){
        this.minute++;
        this.second = 0;
      }
      if(this.second < 10){
        var secondHand = '0'+this.second;
      } else var secondHand = this.second.toString();
      if(this.minute < 10){
        var minuteHand = '0'+this.minute;
      } else var minuteHand = this.minute.toString();
      this.e.text(minuteHand +':'+secondHand);
    };
  }

  function header(){
    this.header = $("#header");
    this.player1 = $("#player1");
    this.player2 = $("#player2");
    this.input = $("#nameInput");
    this.timer = $("#timer");
    this.result = $("#result");

    this.showPlaying = function(){
      this.timer.css({'display': 'flex'});
      this.input.css({'display': 'none'});
      this.player1.css({'display': 'flex'});
      this.player2.css({'display': 'flex'});
      this.result.css({'display':'none'});
    };
    this.hidePlaying = function(){
      this.timer.css({'display': 'none'});
      this.input.css({'display': 'flex'});
      this.player1.css({'display': 'none'});
      this.player2.css({'display': 'none'});
      this.result.css({'display':'none'});
    };
    this.setWinner = function(string){
      this.timer.css({'display': 'none'});
      this.result.css({'display':'flex'});
      this.result.find("p").text(string);
      this.result.find("#ok").click(function(){
        header.hidePlaying();
        $("#gameboard").css({display:'none'});
        $("#start").css({display:'block'});
      });
    }
  }

  var header = new header();
  var tracker;
  var curPlayers;
  var timer;
  var clockIntervalID;
  $("#start").click(function() {
    header.showPlaying();
    timer = new clock($("#clock"));
    clockIntervalID = setInterval(function(){timer.update();},1000);
    curPlayers = new players();
    curPlayers.initialise();
    tracker = new cardTracker();
    var images = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
    this.style.display = "none";
    var board = $("#gameboard");
    board.empty();
    board.show();
    var boardsize = 4;
    var card;
    for(var x = 0;x < boardsize;x++){
      for(var y = 0;y < boardsize;y++){
        card = $("<div></div>").addClass("card").attr('id',''+x+y);
        var image = $("<img />").addClass("card-img");
        var imgNr = Math.floor(Math.random()*images.length);
        image.attr("src",getImage(images[imgNr]));
        image.hide();
        images.splice(imgNr,1);
        card.append(image);
        board.append(card);
      }
    }
    var boardWidth = boardsize * card.outerWidth(true);
    board.css({
      'width':boardWidth,
      'min-width':boardWidth
    });
    $("#timer").css({
      'width':boardWidth,
      'min-width':boardWidth
    });
    $("#result").css({
      'width':boardWidth,
      'min-width':boardWidth
    });
  });

  function player(player,name){
    this.player = player;
    this.name = name;
    this.player.find(".name").text(name);
    this.points = 0;
    this.addPoint = function(){
      this.points++;
      this.drawPoints();
    };
    this.getPoints = function(){
      return this.points;
    };
    this.drawPoints = function(){
      this.player.find(".points").text("Points: "+this.points);
    };
    this.setTurn = function(bool) {
      if(bool){
        this.player.find(".name").css({'font-weight':'bold'});
      } else this.player.find(".name").css({'font-weight':'normal'});
    };
  }

  function players() {
    this.player1 = new player($("#player1"),$("#name1").val());
    this.player2 = new player($("#player2"),$("#name2").val());
    this.player1.setTurn(true);
    this.player2.setTurn(false);
    this.turn = 0;
    this.flips = 0;
    this.initialise = function() {
      this.player1.drawPoints();
      this.player2.drawPoints();
      this.updateFlips();
    }
    this.changeTurn = function(){
      if(this.turn === 0){
        this.turn = 1;
        this.player1.setTurn(false);
        this.player2.setTurn(true);
      } else {
        this.turn = 0;
        this.player1.setTurn(true);
        this.player2.setTurn(false);
      }
    };
    this.getTurn = function(){
      return this.turn;
    };
    this.addPoint = function(){
      if(this.turn === 0){
        this.player1.addPoint();
      } else this.player2.addPoint();
    }
    this.addFlip = function(){
      this.flips++;
      this.updateFlips();
    }
    this.updateFlips = function() {
      $("#flips").text("Flips: "+this.flips);
    }
    this.declareWinner = function() {
      clearInterval(clockIntervalID);
      var string;
      console.log(this.player1.getPoints());
      console.log(this.player2.getPoints());
      if(this.player1.getPoints() > this.player2.getPoints()){
        string = this.player1.name + " wins!";
      } else if(this.player1.getPoints() < this.player2.getPoints()){
        string = this.player2.name + " wins!";
      } else string = "It's a tie!";
      header.setWinner(string);
    }
  }

  function cardTracker(){
    this.setsFound = 0;
    this.cardSets = 8;
    this.cards = 0;
    this.addCard = function(card) {
      if(this.cards === 0){
        this.firstCard = card;
        this.cards++;
      } else if(this.cards === 1){
        this.secondCard = card;
        this.cards++;
      } else {
        alert("too many cards added");
        return;
      }

    }
    this.checkCards = function(){
      if(this.firstCard.attr("src") === this.secondCard.attr("src")){
        curPlayers.addPoint();
        this.setsFound++;
        if(this.setsFound === this.cardSets){
          curPlayers.declareWinner();
        }
        return true;
      } else return false;
    }
    this.clearCards = function() {
      this.cards = 0;
    }
    this.fadeCards = function(callback) {
      this.firstCard.fadeOut(1000);
      this.secondCard.fadeOut(1000,function(){callback.clearCards();});
    }
    this.getCards = function(){
      return this.cards;
    }
  }

  $("#gameboard").on("click", ".card", function () {
    var image = $(this).find("img");
    if(!image.is(":visible")){
      if(tracker.getCards() < 2){
        tracker.addCard(image);
        if(tracker.getCards() == 2){
          image.fadeIn('slow',function(){
            if(!tracker.checkCards()){
              tracker.fadeCards(tracker);
            } else {
              tracker.clearCards();
            }
            curPlayers.changeTurn();
            curPlayers.addFlip();
          });
        } else image.fadeIn('slow');
      }
    }
  });

  function getImage(int){
    var location = "cardsets";
    var image = "set-" + int +".png";
    return location+'/'+image;
  }

});
