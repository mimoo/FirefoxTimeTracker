// VARS

var today_datetime = new Date().toLocaleString()
var today_date = today_datetime.split(' ')[0]
var table_max_elements = 20

// HELPERS
function sec2time(seconds) {

	// to min?
	if (seconds > 60) {
		seconds = seconds / 60
		seconds = Math.floor(seconds)
		seconds += ' min'
	}
	else {
		seconds = Math.floor(seconds)
		seconds += ' sec'
	}

	//
	return seconds
}

/////////////////////////////////////////////
// TODAY NUMBERS
////////////////////////////////////////////

// create sorted array
var sortable = []
total = 0

for(var key in self.options.logs[today_date]) {
  	sortable.push([key, self.options.logs[today_date][key]])
  	total += self.options.logs[today_date][key]
}
sortable.sort(function(a, b) {return b[1] - a[1]})
data = sortable.slice(0, table_max_elements)

// display table
for(var key in data) {
	data[key][2] = Math.ceil(data[key][1]*100/total)
	$('#today tbody').append('<tr><td>'+data[key][2]+'%</td><td>'+data[key][0]+'</td><td>'+sec2time(data[key][1])+'</td></tr>')
}

/////////////////////////////////////////////
// TODAY PIE GRAPH
////////////////////////////////////////////

// create data object

var data_today = []

for(var key in data) {
	data_today.push({
		value: data[key][2],
		label: data[key][0],
        highlight: "#FFC870",
        color: "#FDB45C"
	})
}

var options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : true,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

}


// Chart.js
var ctx = $("#today_pie").get(0).getContext("2d");

var myDoughnutChart = new Chart(ctx).Doughnut(data_today, options);