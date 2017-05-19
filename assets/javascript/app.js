 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDDgLAwZmXDJa0Z83d9Dnb9V5aIK6yKWfA",
    authDomain: "rps-multiplayer-d2660.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-d2660.firebaseio.com",
    projectId: "rps-multiplayer-d2660",
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
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
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

database.ref().set({
	playerOne:"john",
	playerOneMove:"r",
	playerTwo:"mary",
	playerTwoMove:"s"
})

database.ref().on("value", function(snapshot){
	if(snapshot.child("playerOne").exists() && snapshot.child("playerOneMove").exists()){
		console.log(snapshot.child("playerOne").val());
		$("#playerOneName").html(snapshot.child("playerOne").val());
	}

	if(snapshot.child("playerTwo").exists() && snapshot.child("playerOneMove").exists()){
		console.log(snapshot.child("playerTwo").val());
		$("#playerTwoName").html(snapshot.child("playerTwo").val());
	}
});