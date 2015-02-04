/////////////////////////////////////////////

var table_max_elements = 20

/////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////

function sec2time(seconds) {

	// to hours
	if (seconds > 60* 60) {
		hours = Math.floor(seconds / (60 * 60))
		minutes = Math.floor((seconds/60) % 60)
		seconds = hours+"h "+minutes+" min"
	}
	// to min
	else if (seconds > 60 ) {
		seconds = seconds / 60
		seconds = Math.floor(seconds)
		seconds += ' min'
	}
	// to sec
	else {

		seconds = Math.floor(seconds)
		seconds += ' sec'
	}

	//
	return seconds
}

// create sorted array
function sort(logs) {
	var sortable = []
	total = 0
	// object -> array
	for(var key in logs) {
	  	sortable.push([key, logs[key]])
	  	total += logs[key]
	}
	// sort
	var sorted = sortable.sort(function(a, b) {return b[1] - a[1]})
	//
	return [total, sorted]
}

/////////////////////////////////////////////
// TODAY NUMBERS
////////////////////////////////////////////

// init
var today_date = new Date().toLocaleString()
today_date = today_date.split(' ')[0]

// create sorted array
var today = sort(self.options.logs[today_date])
//delete self.options.logs[today_date]

var data = today[1]

// display table & get info
for(var key in data.slice(0, table_max_elements)) {
	// %
	data[key][2] = Math.ceil(data[key][1]*100/total)
	// display
	$('#today tbody').append('<tr><td>'+data[key][2]+'%</td><td>'+data[key][0]+'</td><td>'+sec2time(data[key][1])+'</td></tr>')
}

// display total time
$("#today_total").text(sec2time(today[0]))

/////////////////////////////////////////////
// TODAY PIE GRAPH
////////////////////////////////////////////

// create arguments object
var data_today = []

var color = 100
for(var key in data.slice(0, 5)) {
	data_today.push({
		value: data[key][1],
		label: data[key][0],
        color: "rgb("+color+", 0, 0)"
	})
	color -= data[key][2]
}

var options = {
    segmentShowStroke : false,
    percentageInnerCutout : 50,
    animationSteps : 100,
    animationEasing : "easeOutBounce",
    animateRotate : true,
    animateScale : false,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
}

// Chart.js
var ctx = $("#today_pie").get(0).getContext("2d");

var myDoughnutChart = new Chart(ctx).Doughnut(data_today, options);

//$("#today_pie").after(myDoughnutChart.generateLegend())


/////////////////////////////////////////////
// YESTERDAY
////////////////////////////////////////////

// init

var yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1);
var yesterday_date = yesterday.toLocaleString()
yesterday_date = yesterday_date.split(' ')[0]

// create sorted array
yesterday = sort(self.options.logs[yesterday_date])
//delete self.options.logs[today_date]

var data = yesterday[1]

// display table & get info
for(var key in data.slice(0, table_max_elements)) {
	// %
	data[key][2] = Math.ceil(data[key][1]*100/total)
	// display
	$('#yesterday tbody').append('<tr><td>'+data[key][2]+'%</td><td>'+data[key][0]+'</td><td>'+sec2time(data[key][1])+'</td></tr>')
}

/////////////////////////////////////////////
// YESTERDAY PIE GRAPH
////////////////////////////////////////////

// create arguments object
var data_yesterday = []

var color = 100
for(var key in data.slice(0, 5)) {
	data_yesterday.push({
		value: data[key][1],
		label: data[key][0],
        color: "rgb("+color+", 0, 0)"
	})
	color -= data[key][2]
}

// Chart.js
var ctx = $("#yesterday_pie").get(0).getContext("2d");

var myDoughnutChart = new Chart(ctx).Doughnut(data_yesterday, options);


/////////////////////////////////////////////
// LAST 7 DAYS GRAPH
////////////////////////////////////////////

/*
var week = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
}

week_datas = []

for(var date in self.options.logs) {
	// create sorted array
	var today = sort(self.options.logs[date])
	var data = today[1]

	// fill object
	week_datas.push({
		label: ""
	})
}
*/