var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var urls = require("sdk/url");
var windows = require("sdk/windows");
var tmr = require('sdk/timers');

/////////////////////////////////////////////

var active = true
var current_page = "about:blank"
var last_updated = 0
var current_tab_id = 0

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

//
// HELPERS
//

function get_host(url) {
	return urls.URL(url).host.replace(/^www\./, '')
}

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

//
// TRACKERS
//

// log every 5 minutes if active
tmr.setInterval(log_time, 5000);

// log everytime we change website on current tab
tabs.on('ready', function(tab) {

	// real page?
  	if(tab.host != null) {

  		var host = get_host(tab.url)

	  	// if it's the current tab AND a new page
	  	if(tabs.activeTab.id == tab.id && host != current_page) {
	  		// log
	  		log_time()
	  		
	  		// modify
	  		current_page = host
	  		last_updated = Date.now()
	  	}
  }

});

// log everytime a tab gets activated when active
tabs.on('activate', function(tab) {
  if(tab.host != null) {
  	
  	// modify
  	current_tab_id = tab.id
  	current_page = get_host(tab.url)
  	last_updated = Date.now()
  }

});

// log everytime a tab gets deactivated when active
tabs.on('deactivate', function(tab) {
  if(tab.host != null) {

  	// log
	log_time()
  }

});

/////////////////////////////////////////////
// Active Firefox?
////////////////////////////////////////////

// testing purpose
/*
tmr.setInterval(function(){ 

	console.log(active)

 }, 500);*/

//
// detect if firefox is running in foreground
//

windows.browserWindows.on('open', function(window) {
  	active = true // I'm wondering if this is useless but we never know!
	current_page = "about:blank"
  	last_updated = Date.now()
});


windows.browserWindows.on('activate', function(window) {
  	active = true

  	// check if we select correctly this tab
  	//console.log(tabs.activeTab.title) // == "New Tab"
  	/*
  	if(tabs.activeTab.host != null) {
	  	current_page = get_host(tabs.activeTab.url)
	}
	else {
		current_page = 'about:blank'
	}
	*/
  	last_updated = Date.now()
});

//
// detect is firefox is running in background
//

windows.browserWindows.on('deactivate', function(window) {
	log_time()
	active = false
});

windows.browserWindows.on('close', function(window) {
  	log_time()
  	active = false
});



