

$(document).ready(function() {


  $("form").submit(function(e){
    e.preventDefault();
    var size = $("#layout").val().split('x');
    $("#cardboard").empty();
    deal(size);
  });
  var card;
  function deal(size){
    var sizeCols = size[0];
    var sizeRows = size[1];
    for(var row = 0; row < sizeRows; row++){
      for(var col = 0; col < sizeCols; col++){
        var card = $("<div></div>").addClass("card");
        if(col == 0){
          card.addClass("clearleft");
        }
        $("#cardboard").append(card);
      }
    }
  }

  

  $("#cardboard").on("click",".card",function(){
    $(this).fadeTo(1000,0);
  });

});
