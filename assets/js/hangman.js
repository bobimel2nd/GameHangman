var Artist = 0;
var Guesses = 9;
var Wins = 0;
var Losses = 0;
var AlbumCover = "";
var ArtistName = "";
var ArtistNameStr = "";
var ArtistNameAry=[];
var ArtistDisplay=[];
var LetterGuesses=[];
var Track = "";

function Initialize() {
	document.getElementById("Page").style.opacity = 1.0;
	document.getElementById("Guesses").innerHTML = Guesses.toString(); 
	document.getElementById("Wins").innerHTML = Wins.toString();
	document.getElementById("Losses").innerHTML = Losses.toString(); 
	Announce("I've Picked a Singer/Songwriter from the '70s<br>Do you want to try and guess?");
}

function PickArtist() {
	var i = Math.floor(Math.random() * ArtistJSON.length);
	ArtistName = ArtistJSON[i].Artist;
	ArtistNameStr = ArtistJSON[i].Artist.toUpperCase();
	Track = ArtistJSON[i].Song;
	AlbumCover = ArtistJSON[i].Cover;
	ArtistNameAry = ArtistNameStr.split("");
	ArtistDisplay = ArtistNameStr.split("");
	for(var i=0; i<ArtistDisplay.length; i++) {
		if (ArtistDisplay[i] !== " ") {
			ArtistDisplay[i] = "_"
		}
	}
	document.getElementById("ArtistName").innerHTML = Spaced(ArtistDisplay);
}

function Spaced(ary) {
	var temp = "";
	for(var i=0; i<ary.length; i++) {
		temp += ary[i] + " ";
	}
	return temp
}

function Announce(Text) {
	document.getElementById("Page").onkeypress = null;
    document.getElementById("Text").innerHTML=Text;
    document.getElementById("Announce").style.display = "block";
	PickArtist();
}

function YesAnswer() {
	document.getElementById("Page").onkeypress = function() {GetLetter()};
    document.getElementById("Announce").style.display = "none";
	document.getElementById("Guesses").innerHTML = Guesses;
}

function NoAnswer() {
    var element = document.getElementById("Page");

    element.style.opacity -= 0.1;
    if(element.style.opacity < 0.0) {
        element.style.opacity = 0.0;
    } else {
        setTimeout("NoAnswer()", 100);
    }
}

function Winner() {
	Wins++;	
	document.getElementById("Wins").innerHTML = Wins;
	document.getElementById("Artist").innerHTML = ArtistName;
	document.getElementById("AlbumTrack").innerHTML = Track;
	document.getElementById("Cover").src = "assets/img/" + AlbumCover + ".jpg";
	document.getElementById("Music").src = "assets/mp3/" + Track + ".mp3";
}

function Loser() {
	Losses++;
	document.getElementById("Losses").innerHTML = Losses; 
}

String.prototype.setCharAt = function(index,chr) {
	if(index > this.length-1) return str;
	return this.substr(0,index) + chr + this.substr(index+1);
}

function CheckLetter(l, ary) {
	for (var i=0; i<ary.length; i++) {
		if (ary[i] === l) return i;
	}
	return -1;
}

function GetLetter() {
	var picked = false;
	var Choice = event.keyCode;
	if (Choice >= 97) Choice -= 32;
	var letter = String.fromCharCode(Choice);
	if (CheckLetter(letter, LetterGuesses) >= 0) return; // Already Guessed - Wrong
	if (CheckLetter(letter, ArtistDisplay) >= 0) return; // Already Guessed - Right
	document.getElementById("Hint").innerHTML = "";
	
	var t = false;
	var i = ArtistNameStr.indexOf(letter);
	while (i>=0) {
		t = true;
		ArtistDisplay[i] = letter;
		i = ArtistNameStr.indexOf(letter, i+1);;
	}
	if (t) {
		document.getElementById("ArtistName").innerHTML = Spaced(ArtistDisplay);
	} else {
		LetterGuesses.push(letter);
		document.getElementById("Missed").innerHTML = Spaced(LetterGuesses);
		Guesses--;
		document.getElementById("Guesses").innerHTML = Guesses;
	}

	if (ArtistDisplay.join("") === ArtistNameStr) {
		Winner();
		Announce("You Guessed the Artist <q>" + ArtistNameStr + "</q><br>Want to play again?");
		Guesses = 9;
		LetterGuesses=[];
		document.getElementById("Missed").innerHTML = "";
		document.getElementById("Guesses").innerHTML = Guesses;
		return;
	}
	if (Guesses === 5) {
		document.getElementById("Hint").innerHTML = "Hint: " + Track;
	}
	if (Guesses === 0)  {
		Loser();
		Guesses = 9;
		Announce("Your out of Guesses<br>Artist was <q>" + ArtistNameStr + "<q><br>Want to play again?");
		document.getElementById("Missed").innerHTML = "";
		document.getElementById("Guesses").innerHTML = Guesses;
	}
}
