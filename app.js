﻿var view = this;
var projectorModeWindow;
var modecount = 0;
var texttopass= new Array();
var propValue = new Array();
var teams = new Array();
var showNextId = 0;
var nextTeamInitialIndex = 0;
var teamString = null;
var passedInformation = new Array(); //Hosts the information to be passed to the projector view
var endOfList = false;
var kioskCount = 0;
var eventIndex = 0;
var kioskText = true;
var kioskFlag = true;
var kioskInterval = null;
//view.projectorModeOn opens projector mode.
view.projectorModeOn = function () {
    modecount++;
    var projmode = document.getElementById("projectormode");
    if (modecount % 2 == 1) {
        projmode.value = ("Projector Mode ON");
        projectorModeWindow = window.open("ProjectorDisplay.html", "_blank", "fullscreen=0,toolbar=0,location=0,menubar=1,directories=0,scrollbars=0,resizable=1");
    } else {
		modecount = 0;
		projmode.value = ("Projector Mode OFF");
		kiosk();
        projectorModeWindow.close();
    }
};

//view.removeNextTeam
view.removeNextTeam = function removeCurrentTeam() {
	endOfList = false;
    if (modecount % 2 == 1) {
		if(teamString.length != nextTeamInitialIndex){
			removeById(nextTeamInitialIndex+1);
		}
		else if(teamString.length == nextTeamInitialIndex){
			nextTeamInitialIndex = teamString.length-1;
			alert("No teams are being Shown");
		}
		else{
			removeById(1);
		}
			nextTeamInitialIndex++;
    } 
	else {
        alert("You need to turn Projector Mode on.");
    }
};

//view.showNextTeam
view.showNextTeam = function showNextTeam() {  
	if (modecount % 2 == 1) {
		if(endOfList == false){
		getPassableInformation(nextTeamInitialIndex-1);
		nextTeamInitialIndex--;
		var teamlength = 5;
			if(teamString.length<5){
				teamlength = teamString.length;
			}
			if(nextTeamInitialIndex <= 0){
				nextTeamInitialIndex = 0;
				endOfList = true;
			}
		}
		if(kioskText){		
			if(endOfList == true){
				alert("All team information for the current category is being displayed.");
			}
		}
	}	
	else {
       alert("You need to turn Projector Mode on.");
	}
};

//Kiosk Mode Button functionality
view.kiosk = function kiosk() {
	var kioskMode = document.getElementById("kiosk");
	if(modecount % 2 == 1){
		if (kioskCount % 2 != 1){
		kioskMode.value = "Kiosk Mode ON";
		kioskText = false;
		kioskAlgorithm(true);
		kioskCount++;	
		}
		else{
			kioskMode.value = "Kiosk Mode OFF";
			kioskText = true;
			kioskAlgorithm(false);
			kioskCount = 0;
		}
	}
	else {
		kioskMode.value = "Kiosk Mode OFF";	
		clearInterval(kioskInterval);
		alert("Kiosk Mode is OFF. Turn Projector Mode ON.");
	}
};

function grabResults() {
var obj = new Object();

	$.ajax({
		url: "resultsshort.json",
		dataType: 'json',
		async: false,
		success: function(data) {
		obj=data
		}
	});

	var count=0;
	for(var propName in obj) {
		propValue[count] = obj[propName];
		count++;
	}
	
	for(var i=0; i<propValue.length;i++){
		console.log(propValue[i].results);
	}

	addTable();
};
view.onload = grabResults;

function addTable() {   // Adds the first table
		
        var myTableDiv = document.getElementById("displayTable");
		while (myTableDiv.hasChildNodes()) {
			myTableDiv.removeChild(myTableDiv.lastChild);
		} 
        var table = document.createElement('TABLE');
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
		table.className += 'table table-striped';
        //dynamic table row and column creation
		for (i = 0; i < propValue.length; i++) {
			var tr = document.createElement('TR');
			var td_btn = document.createElement('Button');
			td_btn.className += 'btn btn-default btn-block';
			td_btn.index=i;
			td_btn.onclick = function() {		
				tableButtons(this.index);
				grabResults();
				eventIndex = this.index;
				nextTeamInitialIndex = teamString.length;
				getPassableEventNames(this.index);
			};
			td_btn.appendChild(document.createTextNode(propValue[i].name));
			tr.appendChild(td_btn);
			tableBody.appendChild(tr);
		}
    myTableDiv.appendChild(table);
	
	if(teamString.length>6){
		nextTeamInitialIndex = 6;
	}
};

function tableButtons(id) {   //Adds the scores and team information 
		var myTableDiv = document.getElementById("teamInformation")
		while (myTableDiv.hasChildNodes()) {
			myTableDiv.removeChild(myTableDiv.lastChild);
		} 
        var table = document.createElement('TABLE');
        var tableBody = document.createElement('TBODY');
		var teamScore = null;
		var studentNames = null;
		var currentEventString = null;
		var scoreString = null;
		teamString = propValue[id].results;
		nextTeamInitialIndex = teamString.length;
		table.className += 'table';
        table.appendChild(tableBody);
        //dynamic table row and column creation
		if (teamString !== null){	
			for (i = 0; i < teamString.length; i++) {
				var increment = i+1;
				var tr = document.createElement('TR');
				var td = document.createElement('TD');
				teamScore = teamString[i].score;
				studentNames = " Students: " + teamString[i].students +". " ;
				currentEventString = (teamString[i].team);
				scoreString = " Score: " + teamString[i].score;
				if(scoreString ===  " Score: " + undefined){
				scoreString = '';
				}
				if(studentNames === " Students: " + undefined + ". ")
				{
				studentNames = '';
				}					
				td.appendChild(document.createTextNode("Rank: "+increment+'. '+currentEventString + ". "  + studentNames + scoreString));
				passedInformation[i]=("Rank: "+increment+'. '+currentEventString + ". " + studentNames + scoreString);
				tr.appendChild(td);
				tableBody.appendChild(tr);
			}
		}
    myTableDiv.appendChild(table);
	
	if(teamString.length>6){
		nextTeamInitialIndex = 6;
	}
};

function kioskAlgorithm(flag){
	if(flag){
		if(kioskFlag){
			kioskEvents();
			tableButtons(eventIndex);
			kioskFlag = false;
		}
		kioskInterval = setInterval(function () {kioskTeams()}, 3000);
	}
	if(!flag)
	{
		clearInterval(kioskInterval);
		kioskFlag = true;
	}

};

function kioskTeams(){	
		if(nextTeamInitialIndex == 0)
		{	
			setTimeout(function() {kioskEvents()}, 3000);
			eventIndex++;
			nextTeamInitialIndex = teamString.length;
		}
		else
		{
			showNextTeam();
		}
};
function kioskEvents(){
	if(eventIndex >= propValue.length){
		eventIndex = 0;
	}
	getPassableEventNames(eventIndex);
	tableButtons(eventIndex);
	grabResults();
};

function getPassableInformation(id) {
		sendProjector(   passedInformation[id]  );
	};
	
function getPassableEventNames(id){
		sendClear();
		sendProjector( "event: " + propValue[id].name );
	};
	
function removeById(id){
		sendProjector( "remove:" + id );
	};
	
	
function sendClear(){
		endOfList = false;
		if(teamString.length>6){
			nextTeamInitialIndex = 6;
		}
		else{
			nextTeamInitialIndex = teamString.length;
		}
		sendProjector(  "clear" );
	};
/* This function is included to easily switch between domains. It gets the correct domain name for postMessaging */	
function sendProjector( str ){	
		var temp = projectorModeWindow.location.href;
		temp = temp.substr(0,temp.substr(7).search("/")+7);
		projectorModeWindow.postMessage(  str,  temp   );
	};
	
document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
	case 37: // left
		removeNextTeam();
        break;

    case 39: // right
		showNextTeam();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};



