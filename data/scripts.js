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
	$('#today tbody').append('<tr><td>'+Math.ceil(data[key][1]*100/total)+'%</td><td>'+data[key][0]+'</td><td>'+sec2time(data[key][1])+'</td></tr>')
}

/////////////////////////////////////////////
// TODAY PIE GRAPH
////////////////////////////////////////////
/*
$.plot('#today_pie', data, {
    series: {
        pie: {
            innerRadius: 0.5,
            show: true
        }
    }
});
*/