
  // Initialize Firebase
  var config = {
    apiKey:      "AIzaSyDDgLAwZmXDJa0Z83d9Dnb9V5aIK6yKWfA",
    authDomain:  "rps-multiplayer-d2660.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-d2660.firebaseio.com",
    projectId:   "rps-multiplayer-d2660",
    storageBucket: "rps-multiplayer-d2660.appspot.com",
    messagingSenderId: "392072179191"
  };
  firebase.initializeApp(config);

  
//create a database connection through firebase and set it to var database
var database = firebase.database();


// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#watchers").html(snap.numChildren());
});

//---------------------------------------------------------------------------------------
//ROCK PAPER SCISSORS GAME LOGIC


//set players one and two
var playerOne = "";
var playerTwo = "";
var playerOneMove = "";
var playerTwoMove = "";
var over = false;
var playerOneTopic = "";
var playerTwoTopic = "";


database.ref("/game").on("child_added", function(childSnapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (childSnapshot.child("playerOne").exists() 
    && childSnapshot.child("playerOneMove").exists()) {

    // Set the initial variables for highBidder equal to the stored values.
    playerOne = childSnapshot.val().playerOne; 
    playerOneMove = childSnapshot.val().playerOneMove; 

    // Change the HTML to reflect the initial value
    $("#playerOneName").html(playerOne);
    //$("#playerOneMove").html(playerOneMove);


    // Print the initial data to the console.
    console.log("childSnapshot playerOne" + childSnapshot.val().playerOne);
    console.log("childSnapshot playerOneMove" + childSnapshot.val().playerOneMove);

  }

  // Keep the initial variables for playerOne
  else {

    // Change the HTML to reflect the initial value
    //$("#playerOneName").html(playerOne);
    //$("#playerOneMove").html(playerOneMove);


    // Change the HTML to reflect the initial value
    //$("#playerTwoName").html(playerTwo);
    //$("#playerTwoMove").html(playerTwoMove);

  }

  if(childSnapshot.child("playerTwo").exists() 
    && childSnapshot.child("playerTwoMove").exists()){
    // Change the HTML to reflect the initial value
      // Set the initial variables for playerTwo
    playerTwo = childSnapshot.val().playerTwo; 
    playerTwoMove = childSnapshot.val().playerTwoMove; 
    $("#playerTwoName").html(playerTwo);
   // $("#playerTwoMove").html(playerTwoMove);


    // Print the initial data to the console.
    console.log("childSnapshot playerTwo" + childSnapshot.val().playerTwo);
    console.log("childSnapshot playerTwoMove" + childSnapshot.val().playerTwoMove);


  }

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


function setPlayerValues(){
  if(playerOne == ""){
    playerOne = $("#playerName").val();
    playerOneMove = $("#playerOption").val();
    $("#playerName").val("");
    $("#playerOption").val("");
    database.ref("/game").push({
      playerOne:playerOne,
      playerOneMove:playerOneMove,
    });
    playerOneTopic = $("#playerOption").text();
  }
  else if(playerTwo == ""){
    playerTwo = $("#playerName").val();
    playerTwoMove = $("#playerOption").val();
    $("#playerName").val("");
    $("#playerOption").val("");
    database.ref("/game").push({ 
      playerTwo:playerTwo,
      playerTwoMove: playerTwoMove,
    });

    playerTwoTopic = $("#playerOption").text();
  }
}


//gets the value selected in the drop down menu
$(document.body).on('click', '.dropdown-menu li', function (event) {
    event.preventDefault();
    console.log($(this).attr("value"));
    $("#playerOption").text($(this).text()).append('<span class="caret"></span>');
    $("#playerOption").val($(this).attr("value"));
});


$("#submitInfo").on("click", function(event){
    event.preventDefault();

    if(playerOne == ""){
      $("#gameStatus").empty();
      $("#playerOneName").empty();
      $("#playerTwoName").empty();
    }

    //set the value of player names and moves to form values when submit is clicked
    setPlayerValues();

    //resets menu name to options
    $("#playerOption").text("options").append('<span class="caret"></span>');

    if(playerOneMove !== "" && playerTwoMove !== ""){
            // Creates an array that lists out all of the options (Rock, Paper, or Scissors).
      console.log("checking the game");
      getGif(playerOneTopic);
      getGif(playerTwoTopic);



        if(playerOneMove === "r" && playerTwoMove === "s" || playerOneMove === "p" && playerTwoMove === "r" || playerOneMove === "s" && playerTwoMove === "p"){
          $("#gameStatus").append('<p>player one wins!</p>'+
          	'<p>player two loses!</p>');
          over = true;      
        }
        else if(playerTwoMove === "r" && playerOneMove === "s" || playerTwoMove === "p" && playerOneMove === "r" || playerTwoMove === "s" && playerOneMove === "p"){
          $("#gameStatus").append('<p>player two wins!</p>'+
          	'<p>player one loses!</p>'); 
          over= true;            
        }
        else if(playerTwoMove === "r" && playerOneMove === "r" || playerTwoMove === "p" && playerOneMove === "p" || playerTwoMove === "s" && playerOneMove === "s"){
          $("#gameStatus").append("<p>it's a tie!</p>"); 
          over = true;            
        }

        if (over){
          /*$("#gameStatus").empty();
          $("#playerOneName").empty();  
          $("#playerTwoName").empty();*/
          database.ref().child("/game").remove();
          playerOne = "";
          playerOneMove = "";
          playerTwo = ""; 
          playerTwoMove= "";   
          over = false;
        }

    }

});


    function getGif(topic){
        var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" +
            topic + "&api_key=dc6zaTOxFJmzC&limit=1&rating=pg";
        console.log(queryUrl);
        $.ajax({
          url: queryUrl,
          method: "GET"})
        .done(function(response){
          var results = response.data;
          console.log(response);

          
          for(i=0; i<results.length; i++){

                  var stillUrl = results[i].images.fixed_height_small_still.url;
                  console.log(stillUrl);

                  var animatedUrl = results[i].images.fixed_height_small.url;
                  console.log(animatedUrl);

                  var gifDiv = $('<div class="item" >');

            gifDiv.prepend('<img class="giph" src="'+ animatedUrl +'" data-still="'+stillUrl+'" data-animate="'+animatedUrl+'" data-state="still">');

            $("#gameStatus").append(gifDiv);
          }

        });
      }