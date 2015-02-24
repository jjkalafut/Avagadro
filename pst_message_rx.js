// JavaScript Document
if (window.addEventListener){
 	addEventListener("message", listener, false)
} else {
  	attachEvent("onmessage", listener)
}

var size = 40;

function listener(event){
	if( new String(event.data).valueOf() != new String("clear").valueOf() ){
		document.getElementById("message").innerHTML = document.getElementById("message").innerHTML + newEntry(event.data);
	}else{
		size = 40;
		document.getElementById("message").innerHTML = "";
	}
}

function newEntry(str){
	ret = "<div align=\"center\" style=\" font-size:"+size+"px;\" >";
	ret = ret + str + "<\div>";
	if(size > 20){
		size = size - 5;
	}
	return ret;
}