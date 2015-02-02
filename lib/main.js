var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var urls = require("sdk/url");

/////////////////////////////////////////////

var active = true
var current_page = "about:blank"
var last_updated = 0

/////////////////////////////////////////////
// UI
////////////////////////////////////////////

// should be firefoxtimetracker icon
var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

// should open graphs
function handleClick(state) {
  tabs.open("https://www.mozilla.org/");
}

/////////////////////////////////////////////
// Tracking
////////////////////////////////////////////

// LOGGING FUNCTION
function log_time() {
	// don't log if inactive of no tab was open
	if(!active || current_page == "about:blank"){
		return false
	}

	// logging
	var time_logged = Date.now() - last_updated
	console.log("logging: ", time_logged/1000, "seconds passed on ", current_page)
}

// log every 5 minutes if active
tmr.setInterval(log_time, 5000);

// log everytime a page loads when active
tabs.on('ready', function(tab) {
  if(tab.title != 'about:blank' && urls.isValidURI(tab.url)) {
  	var host = urls.URL(tab.url).host.replace(/^www\./,'')
  	console.log('currently visiting:', host)

  	// log
	log_time()
  	
  	// modify
  	current_page = host
  	last_updated = Date.now()
  }

});

/////////////////////////////////////////////
// Active Firefox?
////////////////////////////////////////////

var windows = require("sdk/windows");
var tmr = require('sdk/timers');

// testing purpose
tmr.setInterval(function(){ 

	console.log(active)

 }, 500);

// detect if firefox is running in foreground
windows.browserWindows.on('deactivate', function(window) {
  active = false
});

windows.browserWindows.on('activate', function(window) {
  active = true
});

/* 

> close

Event emitted when a window is closed. You can't always rely on receiving the close event for every open window. In particular, if the user quits the browser then it's possible that your add-on will be unloaded before all windows are closed.

*/
windows.browserWindows.on('close', function(window) {
  active = false
});

windows.browserWindows.on('open', function(window) {
  active = true
});



