"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user");


// Using the REST API
function loadSongsToDOM() {
  console.log("Need to load some songs, Buddy");

  $(".uiContainer--wrapper").html("");
  let currentUser = user.getUser();
  db.getSongs(currentUser)
  .then(function (songData) {
    console.log("got some data", songData);
    var idArray = Object.keys(songData); /* <-method on songData object, returns array of all id's/keys */
    idArray.forEach(function(key) { /* <- loop through id array */
      songData[key].id = key;  /* <- getting id property of each one */
    });
    console.log("song objects with ID property", songData);
    templates.makeSongList(songData);
  });
}

// loadSongsToDOM(); //<--Move to auth section after adding login btn

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  console.log("clicked save new button");
  let songObj = buildSongObj();
  db.addSong(songObj)
  .then(function(songID) {
    loadSongsToDOM();
  });
});

// go get the song from database and then populate the form for editing.
$(document).on("click", ".edit-btn", function () {
  console.log("clicked on edit button!");
  let songID = $(this).data("edit-id"); /* .data is a jquery method, getting value of data-edit-id attribute */
  db.getSong(songID)
  .then(function(song) {
    return templates.songForm(song, songID);
  })
  .then(function(finishedForm) {
    $(".uiContainer--wrapper").html(finishedForm);
  });
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  console.log("clicked save edit button");
  let songObj = buildSongObj(),
  songID = $(this).attr("id");
  db.editSong(songObj, songID)
  .then(function(data) {
    loadSongsToDOM();
  });
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  console.log("you clicked delete button");
  let songID = $(this).data("delete-id");
  db.deleteSong(songID)
  .then(function() {
    loadSongsToDOM();
  });
});


// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: user.getUser()
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});

// $("#view-songs").click(function() {
//     $(".uiContainer--wrapper").html("");
//     loadSongsToDOM();
// });


// user login section

$("#auth-btn").click(function() {
  console.log("clicked auth");
  user.logInGoogle()
  .then(function(result) {
    let user = result.user;
    console.log("logged in user", user.uid);
    $("#auth-btn").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    loadSongsToDOM();
  });
});

$("#logout").click(function() {
  console.log("clicked logout");
  user.logOut()
  .then(function(result) {
    let user = result.user;
    console.log("logged out user", user.uid);
    $("#logOut").addClass("is-hidden");
    $("#auth-btn").removeClass("is-hidden");
  });
});






