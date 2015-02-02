var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var urls = require("sdk/url");
var windows = require("sdk/windows");
var tmr = require('sdk/timers');
var ss = require("sdk/simple-storage");
var self = require("sdk/self");

/////////////////////////////////////////////

var active = true
var current_page = null
var last_updated = 0

/////////////////////////////////////////////
// STORAGE
////////////////////////////////////////////

if(!ss.storage.logs) {
	ss.storage.logs = {}
}

// if quota is reached we need to remove some logs
function reduceLogs() {
	// TO DO
	// TO DO
	// TO DO
	console.log(Object.keys(ss.storage.logs))
}
ss.on("OverQuota", reduceLogs);

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
	tabs.open(self.data.url("stats.html"));
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

function get_date() {
	// user's locale datetime
	formated_date = new Date().toLocaleString()
	return formated_date.split(' ')[0]
}

// LOGGING FUNCTION
// don't log activeTab because we might want to save
// the last tab (current_tab) and not the one that loaded
function log_time() {
	// don't log if inactive of no tab was open
	if(!active || current_page == null){
		return false
	}

	// logging
	var time_logged = (Date.now() - last_updated)/1000

	if(!ss.storage.logs[get_date()]) {
		ss.storage.logs[get_date()] = {}
	}
	if(!ss.storage.logs[get_date()][current_page]) {
		ss.storage.logs[get_date()][current_page] = 0
	}

	ss.storage.logs[get_date()][current_page] += time_logged

	//debug
	console.log("logging: ", time_logged, "seconds passed on ", current_page)
	console.log(ss.storage.logs)

	// reset time
	last_updated = Date.now()

	//
	return true
}

//
// TRACKERS
//

// log every 5 minutes if active
tmr.setInterval(log_time, 5000);

// log everytime we change website on current tab
tabs.on('ready', function(tab) {
	// real page?
  	if(urls.URL(tab.url).host != null) {

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

// log everytime a tab gets closed
tabs.on('deactivate', function(tab) {
	log_time()
});

// log everytime a tab gets deactivated
tabs.on('close', function(tab) {
	log_time()

});

// a tab gets activated
tabs.on('activate', function(tab) {

	// if it's a real page (not a about:config page for ex)
  	if(urls.URL(tab.url).host != null) {
	  	current_page = get_host(tab.url)
	  	last_updated = Date.now()
  	}

});


/////////////////////////////////////////////
// Active Firefox?
////////////////////////////////////////////

// testing purpose

//tmr.setInterval(function(){console.log(active)}, 500);

//
// detect if firefox is running in foreground
//

windows.browserWindows.on('open', function(window) {
  	active = true
	current_page = null
});


windows.browserWindows.on('activate', function(window) {
  	active = true
  	if(urls.URL(tabs.activeTab.url).host != null) {
	  	current_page = get_host(tabs.activeTab.url)
	  	last_updated = Date.now()
	}
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



