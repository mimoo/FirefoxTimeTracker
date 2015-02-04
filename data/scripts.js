/////////////////////////////////////////////

var table_max_elements = 20

/////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////

// get a nice date format
function get_date(date) {
	var today_date = date.toLocaleString()
	return today_date.split(' ')[0]
}

// returns a nice string from int seconds
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
var today_date = get_date(new Date())

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
var yesterday_date = get_date(yesterday)

// create sorted array
yesterday = sort(self.options.logs[yesterday_date])
//delete self.options.logs[today_date]

var data = yesterday[1]

// display table & get info
for(var key in data.slice(0, table_max_elements)) {
	// %
	data[key][2] = Math.ceil(data[key][1]*100/yesterday[0])
	// display
	$('#yesterday tbody').append('<tr><td>'+data[key][2]+'%</td><td>'+data[key][0]+'</td><td>'+sec2time(data[key][1])+'</td></tr>')
}

// display total time
$("#yesterday_total").text(sec2time(yesterday[0]))


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
// MONTH NUMBERS
////////////////////////////////////////////

// create big object for this month
var month = {}
for(date in self.options.logs) {
	// break if not the same month
	if(date.split('/')[1] != today_date.split('/')[1])
		break

	for(key in self.options.logs[date]){
		if(!month[key])
			month[key] = self.options.logs[date][key]
		else
			month[key] += self.options.logs[date][key]
	}
}
console.log(self.options.logs)

// sort array
var month_object = sort(month).slice(0, table_max_elements)
var month_data = month_object[1]
var total = month_object[0]
// display table & get info
for(var key in month_data.slice(0, table_max_elements)) {
	// %
	month_data[key][2] = Math.ceil(month_data[key][1]*100/total)
	// display
	$('#month tbody').append('<tr><td>'+month_data[key][2]+'%</td><td>'+month_data[key][0]+'</td><td>'+sec2time(month_data[key][1])+'</td></tr>')
}

// display total time
$("#month_total").text(sec2time(total))

/////////////////////////////////////////////
// MONTH GRAPH
////////////////////////////////////////////

// function helper

function sec2str(sec) {
	hours = Math.floor(sec / (60*60))
	minutes = Math.floor(sec / 60) % 60
	return hours * 100 + minutes
}

// init
data = []
dates = []

principal = {
	fillColor: "rgba(220,220,220,0.2)",
	strokeColor: "rgba(220,220,220,1)",
	pointColor: "rgba(220,220,220,1)",
	pointStrokeColor: "#fff",
	pointHighlightFill: "#fff",
	pointHighlightStroke: "rgba(220,220,220,1)"
}

// get most visited website
label = month_data[0][0]
principal['label'] = label

// loop over day of month
var last_month = new Date()
last_month.setDate(1)
var now = new Date(Date.now())

for (last_month; last_month <= now; last_month.setDate(last_month.getDate() + 1)) {
	// dates
	date = get_date(last_month)
	dates.push(date)
	// logs
	if(!self.options.logs[date] || !self.options.logs[date][label])
		data.push(0)
	else
		data.push(sec2str(self.options.logs[date][label]))
}

// create object
principal['data'] = data

var chart = {
    labels: dates,
    datasets: [principal]
}

// options
options = {

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

};


// draw
var ctx = $("#month_graph").get(0).getContext("2d")
var myLineChart = new Chart(ctx).Line(chart, options)