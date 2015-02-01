var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var urls = require("sdk/url");

/* 
global vars 
*/
var active = true
var current_page = "about:blank"
var last_updated = 0

/* 
button
 */
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

function handleClick(state) {
  tabs.open("https://www.mozilla.org/");
}

/* 
tracking 
*/

// SAVING FUNCTION
function log_time() {
	// don't save if inactive of no tab was open
	if(!active || current_page == "about:blank"){
		return false
	}

	// save time
	var time_logged = Date.now() - last_updated
}

// log every 5 minutes if active
tmr.setInterval(log_time, 5000);

// everytime a page loads when active
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

/*
 active firefox?
 */
//
var windows = require("sdk/windows");
var tmr = require('sdk/timers');

tmr.setInterval(function(){ 

	console.log(active)

 }, 500);


// add a listener to the 'close' event
windows.browserWindows.on('deactivate', function(window) {
  active = false
});

windows.browserWindows.on('activate', function(window) {
  active = true
});

windows.browserWindows.on('close', function(window) {
  active = false
});

windows.browserWindows.on('open', function(window) {
  active = true
});



