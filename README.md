# FirefoxTimeTracker

I always thought I could reduce the amount of time slacking if I could track my time on facebook, reddit, hackernews... like I track my calories intake to reduce my weight. I couldn't find a good firefox plugin for that so I decided to make one.

# How to use it?

**THIS IS A WORK IN PROGRESS. NOTHING IS WORKING. PLEASE COME BACK LATER**

# The thinking behind it

## track days?

track days or periods? show tracking per periods. Create a new period if nothing has been logged in 6 hours? multiple periods can exist in a day (coz some ppl will log the morning before work and the night after work)... mmm, hard problem to tackle. Create algorithm to guess when the person is sleeping according to the day and to how long firefox has been opened. For example, the end of a period can be until 6am, the start of a period is always starting from 6am.

## what not to log?

* stop logging when we are not looking at firefox
* stop logging if we are inactive for too long (we might not be looking at firefox anymore). How can we now we've been inactive for too long? Mouse has no movements + keyboard inaction > 5 minutes is a good one.

# Note on the code

## How to know if firefox is active with Firefox SDK API?

* active = true by default
* if a window is closed stop logging (set active to false)
* if a window is open, log current_tab (set active to true)

## How to log before firefox closes

* log every **5 minutes** so if firefox is closed only a few minutes might have been lost

> **CLOSE**: Event emitted when a window is closed. You can't always rely on receiving the close event for every open window. In particular, if the user quits the browser then it's possible that your add-on will be unloaded before all windows are closed.

# To Do List

## Extract real domain

* remove subdomain in get_host function

## Graphs

* make beautiful graphs

## Save all this info somewhere

* save info online? on user's disk?