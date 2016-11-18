"use strict";

let firebase = require("./firebaseConfig"),
  provider = new firebase.auth.GoogleAuthProvider(),
  currentUser = null;


// listen for log in or log out actions & set currentUser's value
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user.uid;
    console.log("currentUser logged in?", currentUser);
  } else {
    currentUser = null;
    console.log("currentUser logged out?", currentUser);
  }
});


function logInGoogle() {
  console.log("wazzzuuupppp, auth?");
  return firebase.auth().signInWithPopup(provider); /*this returns a promise here */
}

function logOut() {
  return firebase.auth().signOut();
}

function getUser() {
  return currentUser;
}


module.exports = {logInGoogle, logOut, getUser};








