
var mjs = (function mjs() {

	var wrk;

	var createNavigator = function createNavigator(menu, menuitem, link) {
		var nav = link || null;
		var localnav = function localnav() {
			navigate(nav);
			for (i = 0; i < menu.childNodes.length; i+= 1) {
				if(menu.childNodes[i].setAttribute) {
					menu.childNodes[i].setAttribute("class", "");
				}
			}
			menuitem.setAttribute("class", "active");
		};
		return localnav;
	};

	var clearContent = function clearContent(elem) {
		elem.innerHTML = "";
	};

	var skeleton = function skeleton(sklt) {
		var elem, content = document.getElementById("content");
		clearContent(content);
		if(sklt === "jumbo") {
			elem = createChild(content, "div", {id: "jumbo", class: "jumbotron"});
			createChild(elem, "h1", { id: "title"}).textContent = ",.-:;,.-.,.-";
			createChild(elem, "p", { id: "text"}).textContent = ",.-:;,.-.,.-";

		} else if(sklt === "normal") {
		} else {
			createChild(content, "h1", { id: "title"}).textContent = ",.-:;,.-.,.-";
		}
	};

	var navigate = function navigate(nav) {
		skeleton(nav.skeleton);
		if (nav.view) {
			wrk.postMessage(nav);
		} else {
			wrk.postMessage(nav.page);
		}
	}

	var renderView = function renderView(view, data) {
		var name, regex;
		if (typeof data === "object") {
			for(name in data) {
				regex = new RegExp("@" + name, "ig");
				console.log(regex.test(view));
				console.log(regex.exec(view));
				view = view.replace(regex, data[name]);
			}
		}
		return view;
	}


	var createChild = function createChild(parent, name, atts) {
		var child = document.createElement(name);
        atts = atts || {};
        for (var att in atts) {
            child.setAttribute(att, atts[att]);
        }
		parent.appendChild(child);
        return child;
	};

	var updateMenu = function updateMenu(data) {
		var i, nav, li, a, dp, menu = document.getElementById("topmenu");
		if(menu) {
			for(i = 0; i < data.menuitems.length; i += 1) {
				li = createChild(menu, "li");
				a = createChild(li, "a");
				a.textContent = data.menuitems[i].display;
				nav = createNavigator(menu, li, data.menuitems[i]);
				a.addEventListener("click", nav);
				if (data.menuitems[i].page === data.defaultPage) {
					a = document.getElementById("defaultpage");
					a.addEventListener("click", nav);
					nav();
				}
			}
		} else {
			console.log("no menu");
		}
	};

	var copyElement = function copyElement(element) {
		var result = element.cloneNode();
		element.parentElement.appendChild(result);
		return result;
	}

	var updateElement = function updateElement(element, data) {
		var i;
		if (element) {
			if(Array.isArray(data)) {
				for(i = 0; i < data.length; i += 1) {
					if(i > 0) {
						element = copyElement(element);
					}
					element.textContent = data[i];
				}
			} else if(typeof data === "string") {
				element.textContent = data;
			}
		}
	};

	var updatePage = function updatePage(data) {
		var elem;
		if(data.title) {
			updateElement(document.getElementById("title"), data.title);
		}
		
		if(data.text){
			updateElement(document.getElementById("text"), data.text);
		}
		
	};

	var updateView = function updateView(view) {
		var content = document.getElementById("content");
		content.innerHTML = renderView(view);
	};

	var errorPage = function errorPage(data) {
		var title = document.getElementById("title");
		title.textContent = "An unforseen event has occurred (" + data + ")";
	};

	var onmessage = function onmessage(e) {
		if(typeof e.data === "object") {
			if(e.data.view) {
				updateView(e.data.view);
			}else if(e.data.data === "menu") {
				updateMenu(e.data);
			} else if(e.data.data === "page") {
				updatePage(e.data);
			}
		} else if (typeof e.data === "number") {
			errorPage(e.data);
		} else {
			console.log("Message received");
			console.log(typeof e.data);
			console.log(e.data);
		}
	};


	if(window.Worker) {
		console.log("Workerz available");
		wrk = new Worker("./js/mjwrk.js");
		wrk.onmessage = onmessage;
		wrk.postMessage("menu");

	} else {
		console.log("No workerz!");
	}

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./js/mjsrvwrk.js', { scope: '/mjnet/js/' }).then(function(reg) {
			if(reg.installing) {
				console.log('Service worker installing');
			} else if(reg.waiting) {
				console.log('Service worker installed');
			} else if(reg.active) {
				console.log('Service worker active');
			} else {
				console.log(reg);
			}
			reg.update();
		
		}).catch(function(error) {
			// registration failed
			console.log('Registration failed with ' + error);
		});
	}

	return {
		clearContent: clearContent,
		renderView: renderView,
		createChild: createChild
	}
})();