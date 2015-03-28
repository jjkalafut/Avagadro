// JavaScript Document
if (window.addEventListener){
 	addEventListener("message", listener, false)
} else {
  	attachEvent("onmessage", listener)
}

var size = 40;

function listener(event){
	var str = new String(event.data);
	var pos = str.search("event:");
	if( pos >= 0){
		document.getElementById("Title").innerHTML = str.substr(pos+7);
		return;
	}
	pos = str.search("Rank: ");
	if(pos >= 0 ){
		placeRank( str.charAt(pos+6), str.substr(pos+9));
		return;
	}
	
	
	if( str.valueOf() != new String("clear").valueOf() ){
		var teams = document.getElementsByClassName("teamName");
		var students = document.getElementsByClassName("studentNames");
		var i;
		for( i = 0; i < teams.length; i++){
			teams[i].innerHTML="";
			students[i].innerHTML="";
		}
	}
}

function placeRank( strInd, strVals ){
	var next = strVals.search(". ");
	if( next > 0){
		document.getElementById("teamName"+strInd).innerHTML = strVals.substr(0,next);// + "<\\br>";
		document.getElementById("studentName"+strInd).innerHTML = strVals.substr(next+1);
	}
	else{
		document.getElementById("teamName"+strInd).innerHTML = strVals;
		document.getElementById("studentName"+strInd).innerHTML = "";
	}
}
