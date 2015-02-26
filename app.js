var view = this;
var projectorModeWindow;
var modecount = 0;
var texttopass= new Array();
var propValue = new Array();
var teams = new Array();
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
    if (modecount == 1) {
        document.getElementById("textHolder").nodeValue = ("Showing Next Team");
    } else {
        document.getElementById("textHolder").nodeValue = ("You need to open the presentation");
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
		//rearranges score array from highest to lowest
		teams.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score) } );
		for(var i=0;i<teams.length;i++){
			var tempscore="No score"
			if (teams[i].score!==undefined)
			{
				tempscore=teams[i].score;
			}
			if (teams[i].score===null)
			{
				teams[i].score='';
			}
			texttopass[i]=(teams[i].team + ": "+ tempscore);
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
			//var td = document.createElement('TD');
			var td_btn = document.createElement('Button');
			td_btn.className += 'btn btn-default btn-block';
			td_btn.index=i;
			td_btn.onclick = function() {		
				tableButtons(this.index);
				grabResults();
			};
			//td.appendChild(document.createTextNode(propValue[i].name));
			td_btn.appendChild(document.createTextNode(propValue[i].name));
			//tr.appendChild(td);
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
        var table = document.createElement('TABLE')
        var tableBody = document.createElement('TBODY')
		var teamScore = null;
		var currentEventString = null;
		table.className += 'table';
        table.appendChild(tableBody);
		var teamString = propValue[id].results;
        //dynamic table row and column creation
		for (i = 0; i < teamString.length; i++) {
			var tr = document.createElement('TR');
			var td = document.createElement('TD');
			var td_btn = document.createElement('Button');
			td_btn.className += 'btn btn-default btn-block';
			td_btn.index=i;
			td_btn.onclick = function() {
				getPassableInformation(this.index);
			};
			teamScore = teamString[i].score;
			currentEventString = (teamString[i].team);
			td.appendChild(document.createTextNode(currentEventString + ": " + teamScore));
			td_btn.appendChild(document.createTextNode('Display Score'));
			passedInformation[i]=currentEventString+": "+teamScore;
			td.appendChild(td_btn);
			tr.appendChild(td);
			tableBody.appendChild(tr);
		}
    myTableDiv.appendChild(table);
};
function getPassableInformation(id) {
		projectorModeWindow.postMessage(   passedInformation[id],  "http://www.johnkalafut.com"    );
		//alert(passedInformation[id]);
	};
function sendClear(){
	projectorModeWindow.postMessage(   "clear",  "http://www.johnkalafut.com"    );
};



