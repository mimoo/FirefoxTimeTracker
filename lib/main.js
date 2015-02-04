var buttons = require('sdk/ui/button/action')
var tabs = require("sdk/tabs")
var urls = require("sdk/url")
var windows = require("sdk/windows")
var tmr = require('sdk/timers')
var ss = require("sdk/simple-storage")
var prefs = require("sdk/preferences/service");
var self = require("sdk/self")
var pageMod = require("sdk/page-mod");

/////////////////////////////////////////////

var active = true
var current_page = null
var last_updated = 0
var idle = 0

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
	//console.log(Object.keys(ss.storage.logs))
}
ss.on("OverQuota", reduceLogs)

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
})

// should open graphs
function handleClick(state) {
	//tabs.open(self.data.url("stats.html"))

	tabs.open({
	  	url: "./stats.html",
	  	onReady: function(tab) {
	   		tab.attach({

		      	contentScriptOptions: {
		        	'logs': ss.storage.logs
		      	},
	      		contentScriptFile: [
	      			"./jquery-2.1.3.min.js",
	      			"./Chart.min.js",
	      			"./scripts.js"
	      		]
		    })
	  	}
	})

}

/////////////////////////////////////////////
// Tracking
////////////////////////////////////////////

//
// HELPERS
//

// remove subdomains
function get_host(url) {
	// check for stat page
	if(url.indexOf('.') === -1) {
		return urls.URL(url).host
	}

	var tld = urls.getTLD(url)
	var domains = urls.URL(url).host.split('.')
	// simple tld
	if(tld.indexOf('.') === -1) 
		url = domains[domains.length-2]
	// double tld
	else
		url = domains[domains.length-3]
	//
	return url+'.'+tld
}

// get date of user's zone
function get_date() {
	formated_date = new Date().toLocaleString() //datetime
	return formated_date.split(' ')[0]
}

// LOGGING FUNCTION
// don't log activeTab because we might want to save
// the last tab (current_tab) and not the one that loaded
function log_time() {
	// don't log if inactive of no tab was open
	// and not our stats.html page (no .)
	if(!active || current_page == null || current_page.indexOf('.') === -1)
		return false

	// logging
	var time_logged = (Date.now() - last_updated)/1000

	if(!ss.storage.logs[get_date()]) 
		ss.storage.logs[get_date()] = {}
	
	if(!ss.storage.logs[get_date()][current_page]) 
		ss.storage.logs[get_date()][current_page] = 0

	ss.storage.logs[get_date()][current_page] += time_logged

	//debug
	//console.log(ss.storage.logs)

	// reset time
	last_updated = Date.now()

	//
	return true
}

//
// IDLE TIME
//

// attach mouse/key detector in everypage
// if mouse moves out of the browser (if browser is not
//	full screen, then it won't be detected)
pageMod.PageMod({
  	include: "*",
  	contentScriptFile: "./idle.js",
  	onAttach: function(worker) {
  		// reset idle on event from contentScript
  	    worker.port.on("alive", function() {
  	      	idle = 0
  		})
	}
})


//
// TRACKERS
//

var auto_log = 5 // log every 5 seconds 
var idled = 60*10 // considered idled after 10 minutes

tmr.setInterval(function(){
	// if we are running firefox in foreground
	// we check for idling
	if(active)
		idle++
	// log if not idled
	if(idle < (idled/auto_log))
		log_time() // will not log if not active
	else
		last_updated = Date.now()

}, auto_log * 1000)

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

})

// log everytime a tab gets closed
tabs.on('deactivate', function(tab) {
	log_time()
})

// log everytime a tab gets deactivated
tabs.on('close', function(tab) {
	log_time()

})

// a tab gets activated
tabs.on('activate', function(tab) {

	// if it's a real page (not a about:config page for ex)
  	if(urls.URL(tab.url).host != null) {
	  	current_page = get_host(tab.url)
	  	last_updated = Date.now()
  	}

})


/////////////////////////////////////////////
// Active Firefox?
////////////////////////////////////////////

// testing purpose

//tmr.setInterval(function(){console.log(active)}, 500)

//
// detect if firefox is running in foreground
//

windows.browserWindows.on('open', function(window) {
  	active = true
	current_page = null
})


windows.browserWindows.on('activate', function(window) {
  	active = true
  	if(urls.URL(tabs.activeTab.url).host != null) {
	  	current_page = get_host(tabs.activeTab.url)
	  	last_updated = Date.now()
	}
})

//
// detect is firefox is running in background
//

windows.browserWindows.on('deactivate', function(window) {
	log_time()
	active = false
})

windows.browserWindows.on('close', function(window) {
  	log_time()
  	active = false
})



