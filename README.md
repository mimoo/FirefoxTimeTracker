# FirefoxTimeTracker

I always thought I could reduce the amount of time slacking if I could track my time on facebook, reddit, hackernews... like  tracking calories intake to reduce weight. I couldn't find a good firefox plugin for that so I decided to make one.

# How to use it?

Open the file `FirefoxTimeTracker.xpi` with Firefox (`Ctrl+O`).

Remember to come back here often to check if the plugin has been updated. It is still a beta but it works.

You will see a "firefox" icon (for the moment): 

![firefoxtimetracker](http://cryptologie.net/upload/firefox1.PNG)

Clicking on it will bring you to a new page displaying you basic statistics on your day

![firefox time tracker](http://cryptologie.net/upload/firefox2.PNG)

# The thinking behind it

## what not to log?

Whenever Firefox is not in the foreground nothing will get logged. The plugin also monitor for mouse movement and keys being pressed, if none of them are actively used for more than 2 minutes then the user is assumed inactive and we stop logging.

# To Do List

* better icon
* display quick view of logs when hovering the icon
* remove subdomain in get_host function

## SYNC

* sync the logs with firefox sync (easy)

## track days?

The plugin actually tracks periods starting and stopping at midnight. I am thinking of changing that to 6 or 7am.

## Track time correctly

* detect when firefox is closing and log before it closes
* do we really need to save every 5 seconds? -> maybe we should stop this and only save when we switch tab.

## Graphs

* make beautiful graphs
.
## Storage

* save info online? on user's disk?
* remove old logs when quota is reached! (reduceLogs not coded)
* when a new day is created, reduce the list of the previous day (so we should keep a track of what was the "previous day")

## Correct javascript?

* Is storing the logs in an object the best way? It seems cumbersome to declare a new object for the date and a new object for the host everytime

## Dected when browser is in foreground

Maybe the "active" var is not correctly handled. Check for "foreground" here: http://mxr.mozilla.org/mozilla-central/source/mobile/android/chrome/content/browser.js#5445
