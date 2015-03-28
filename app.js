var view = this;
var projectorModeWindow;
var modecount = 0;
var texttopass= new Array();
var propValue = new Array();
var teams = new Array();
var showNextId = 0;
var nextTeamInitialIndex = 0;
var teamString = null;
var passedInformation = new Array(); //Hosts the information to be passed to the projector view
//view.projectorModeOn opens projector mode.
view.projectorModeOn = function () {
    modecount++;
    var projmode = document.getElementById("projectormode");
    if (modecount % 2 == 1) {
        projmode.value = ("Projector Mode ON");
        projectorModeWindow = window.open("ProjectorDisplay.html", "_blank", "fullscreen=0,toolbar=0,location=0,menubar=1,directories=0,scrollbars=0,resizable=1");
    } else {
        projectorModeWindow.close();
        projmode.value = ("Projector Mode OFF");
        modecount = 0;
    }
};

//view.removeNextTeam
view.removeNextTeam = function removeCurrentTeam() {
    if (modecount == 1) {
        document.getElementById("textHolder").nodeValue = ("Removing Current Team");
    } else {
        document.getElementById("textHolder").nodeValue = ("You need to open the presentation");
    }
};

//view.showNextTeam
view.showNextTeam = function showNextTeam() {  
		getPassableInformation(nextTeamInitialIndex-1);
		//getPassableNames(nextTeamInitialIndex);
		nextTeamInitialIndex--;
		var teamlength = 5;
		if(teamString.length<5){
			teamlength = teamString.length;
		}
		if(nextTeamInitialIndex == 0){
			nextTeamInitialIndex=teamString.length;
			//Here is where the "team clear" should be implemented.
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
	for(var j=0;j<count;j++){
		if(propValue[j].results===null){
		}
		else{
			teams=propValue[j].results;
		}
		for(var i=0;i<teams.length;i++){
			var tempscore= "No score";
			var tempteam = "No team";
			if (teams[i].score !== "undefined")
			{
				tempscore=teams[i].score;
			}
			if (teams[i].score === null)
			{
				teams[i].score='';
			}
			if(teams[i].team !== "undefined"){
				tempteam = teams[i].team;
			}
			if(teams[i].team === null){
				tempteam = teams[i].team = '';
			}
			texttopass[i]=(tempteam + ": "+ tempscore);
		}
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
				nextTeamInitialIndex = teamString.length;
				getPassableEventNames(this.index);
			};
			td_btn.appendChild(document.createTextNode(propValue[i].name));
			tr.appendChild(td_btn);
			tableBody.appendChild(tr);
		}
    myTableDiv.appendChild(table);
};

function tableButtons(id) {   //Adds the scores and team information when the Expand Teams buttons are clicked
		var myTableDiv = document.getElementById("teamInformation")
		while (myTableDiv.hasChildNodes()) {
			myTableDiv.removeChild(myTableDiv.lastChild);
		} 
        var table = document.createElement('TABLE');
        var tableBody = document.createElement('TBODY');
		var teamScore = null;
		var studentNames = null;
		var currentEventString = null;
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
				studentNames = " Students: " + teamString[i].students;
				currentEventString = (teamString[i].team);
				//td.appendChild(document.createTextNode(currentEventString + ": " + teamScore+'.'+ " Students: " + studentNames));
				if(studentNames === " Students: " + undefined)
				{
				studentNames = '';
				}					
				td.appendChild(document.createTextNode("Rank: "+increment+'. '+currentEventString + ". "  + studentNames));
				passedInformation[i]=("Rank: "+increment+'. '+currentEventString + ". " + studentNames);
				tr.appendChild(td);
				tableBody.appendChild(tr);
			}
		}
    myTableDiv.appendChild(table);
};
function getPassableInformation(id) {

		projectorModeWindow.postMessage(   passedInformation[id],  "http://www.johnkalafut.com"    );
		//alert(passedInformation[id]);

	};
function getPassableEventNames(id){
		projectorModeWindow.postMessage( "event: " + propValue[id].name,  "http://www.johnkalafut.com"    );
		//alert(propValue[id].name);
	};
	
	
	
function sendClear(){
	//projectorModeWindow.postMessage(   "clear",  "http://www.johnkalafut.com"    );
};
/*function getPassableInformation(id) {
		projectorModeWindow.postMessage(   passedInformation[id],  "http://www.jerrypendleton.com"    );
		showNextId = id;
		//alert(passedInformation[id]);
	};

function SendClear(){
	projectorModeWindow.postMessage(   "clear",  "http://www.jerrypendleton.com"    );
};
*/



