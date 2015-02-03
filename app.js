var view = this;
var projectorModeWindow;
var modecount = 0;
var texttopass=new Array();
var propValue = new Array();
var teams=new Array();

//view.projectorModeOn opens projector mode.
view.projectorModeOn = function () {
    modecount++;
    var projmode = document.getElementById("projectormode");
    if (modecount % 2 == 1) {
        projmode.nodeValue = ("Projector Mode is On");
        projectorModeWindow = window.open("ProjectorDisplay.html", "_blank", "fullscreen=0,toolbar=0,location=0,menubar=1,directories=0,scrollbars=0,resizable=1");
    } else {
        projectorModeWindow.close();
        projmode.nodeValue = ("Projector Mode is Off");
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

view.onload = function () {
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
	
	for(var i=0; i<propValue.length;i++)
	{
		console.log(propValue[i].results);
	}
	//obj = JSON.parse(json);
	for(var j=0;j<count;j++)
	{

		if(propValue[j].results===null)
		{
		}
		else
		{
			teams=propValue[j].results;
		}
		//alert(eventname);
		
		//rearranges score array from lowest to highest
		teams.sort(function(a,b) { return parseFloat(a.score) - parseFloat(b.score) } );
		
		for(var i=0;i<teams.length;i++)
		{
			var tempscore="No score"
			if (teams[i].score!==undefined)
			{
				tempscore=teams[i].score;
				//teams[i].score='null';
			}
			if (teams[i].score===null)
			{
				teams[i].score='';
			}
			texttopass[i]=(teams[i].team + ": "+ tempscore);
			//alert(texttopass[i]);
			//if (teams[i].students!==undefined)         <-------this will be moved later?
			//{
				//alert(teams[i].students);
			//}
		}
	}
	addTable();
};

function addTable() {
       
        var myTableDiv = document.getElementById("displayTable")
        var table = document.createElement('TABLE')
        var tableBody = document.createElement('TBODY')

        //table.border = '1'
        table.appendChild(tableBody);

        //dynamic table row and column creation
		for (i = 0; i < propValue.length; i++) {
			var tr = document.createElement('TR');
			var td = document.createElement('TD');
			var td_btn = document.createElement('Button');
			td_btn.index=i;
			td_btn.onclick = function() {
			if(modecount==1)
			{
				alert(this.index);
			}
			else
			{
				tableButtons(this.index);
			}
			};
			td.appendChild(document.createTextNode(propValue[i].name));
			td_btn.appendChild(document.createTextNode('Display Event'));
			tr.appendChild(td);
			tr.appendChild(td_btn);
			tableBody.appendChild(tr);
		}
    myTableDiv.appendChild(table);
	document.body.appendChild(table);
};

function tableButtons(id) {
	var teamString = null;
	var teamScore = null;
	var currentEventString = null;
	var currentEvent = document.getElementById("teamInformation");
	currentEvent.innerHTML = " ";
	if(propValue[id].results === null)
	{
		teamScore = 0;
		currentEventString = "Undefined";
		currentEvent.innerHTML = currentEventString+": "+teamScore;
	}
	else
	{
		var teamString = propValue[id].results;
		for(i=0;i<teamString.length;i++)
		{
			teamScore = teamString[i].score;
			currentEventString = (teamString[i].team);
			//currentEvent.innerHTML = currentEventString+": "+teamScore;
			currentEvent.appendChild(document.createTextNode(currentEventString+": "+teamScore));
			currentEvent.appendChild(document.createElement("br"));
		}
	}
};
