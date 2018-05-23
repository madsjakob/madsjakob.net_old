console.log("Hello from mjwrk");

var sendMessage = function sendMessage(data) {
	//console.log(data);
	if (data[0] === "<") {
		postMessage({ view: data });
	} else {
		postMessage(JSON.parse(data));
	}
};

var load = function load(data, onsuccess) {
	var xhr = new XMLHttpRequest();
	var success = onsuccess || function (x) { console.log("wrk!: " + x); };
	var onreadystatechanged = function() {
		//console.log(xhr.readyState + " " + xhr.status + " " + data);
		if (xhr.readyState == 4 && xhr.status == 200) {
			success(xhr.responseText);
		} else if (xhr.readyState == 4 && xhr.status == 404) {
			postMessage(404);
		} else if (xhr.readyState == 4) {
			postMessage(xhr.status);
		}
	};

	xhr.onreadystatechange = onreadystatechanged; 
	//xhr.open("get", data + '?_=' + new Date().getTime(), true);
	xhr.open("get", data, true);
	xhr.send();
};

var loadData = function loadData(data, onsuccess) {
	var success = onsuccess || sendMessage;
	load("../data/"+ data + ".txt", success)
};

var renderControl = function renderControl(data, ondone) {
	var i, result = "", wait = [];
	ondone = ondone || console.log;

	var waitRender = function waitRender() {
		var i = 0, ok = true;
		while(ok && i < wait.length) {
			ok = wait[i].ok;
			i += 1;
		}
		if(ok) {
			ondone(result);
		} else {
			setTimeout(waitRender, 20);
		}
	};
	
	var appendResult = function appendResult(html) {
		result = result + html;	
	};

	var controlloaded = function controlloaded(html) {
		var temp;
		if(Array.isArray(data.data)) {
			for(i = 0; i < data.data.length; i += 1) {
				temp = { ok: false, done: function(html) {
					appendResult(html);
					temp.ok = true;
				}};
				wait.push(temp);
				renderView(html, data.data[i], temp.done);
			}
		} else {
			temp = { ok: false, done: function(html) {
				appendResult(html);
				temp.ok = true;
			}};
			wait.push(temp);
			renderView(html, data.data, temp.done);
		}
		
		waitRender();
		
	};
	loadControl(data.control, controlloaded)
};


var renderView = function(html, data, ondone) {
	var name, regex, text, sub, subrenders = [];
	ondone = ondone || sendMessage;
	
	var awaitRender = function awaitRender() {
		var i = 0, ok = true;
		while(ok && i < subrenders.length) {
			ok = ok && subrenders[i].ok === true;
			i += 1;
		}
		if (ok) {
			ondone(html);
		} else {
			//console.log("waiting...");
			setTimeout(awaitRender, 20);
		}

	};
	if (typeof data === "object") {
		for(name in data) {
			regex = new RegExp("@" + name, "ig");
			if(typeof data[name] === "string") {
				html = html.replace(regex, data[name]);
			} else {
				// console.log("@" + name); 
				// console.log(data[name]);
				sub = { ok: false, ondone: function(result) {
					 html = html.replace(regex, result);
					sub.ok = true;
				}  }
				subrenders.push(sub);
				renderControl(data[name], sub.ondone);
			}
		}
	}
	awaitRender();
};

var loadViewData = function loadViewData(html, view) {
	loadData(view.data, function(data) { renderView(html, JSON.parse(data)); })
}

var loadControl = function loadControl(control, onsuccess) {
	onsuccess = onsuccess || console.log;
	load("../views/" + control + ".html", onsuccess);
}

var loadView = function loadView(view) {
	load("../views/" + view.view + ".html", function (html) { loadViewData(html, view); });
}


var onmessage = function onmessage(e) {
	if(typeof e.data === "string") {
		loadData(e.data);
	} else if (typeof e.data === "object") {
		if(e.data.view) {
			loadView(e.data);
		} else if (e.data.data) {
			loadData(e.data.data)
		}
	} else {
		console.log(e.data);
	}
};