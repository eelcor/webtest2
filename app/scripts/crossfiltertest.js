$.get('http://api.openweathermap.org/data/2.5/forecast?q=Leiden,nl&mode=json&units=metric', function(responsetext) {
    var data = [];
    for(index in responsetext.list){
        var d = {};
        var obj = responsetext.list[index];
        d.Date = obj.dt;
        d.TempMin = obj.main.temp_min;
        d.TempMax = obj.main.temp_max;
        d.Temp = obj.main.temp;
        d.Pressure = obj.main.pressure;
        d.Humidity = obj.main.humidity;
        d.Description = obj.weather[0].description;
        d.MainDesc = obj.weather[0].main;
        d.Wind = obj.wind.speed;
        d.WindDir = obj.wind.deg;
        d.RainHeight = obj.rain;
        data.push(d);
    };
    analyze(data);
});

function analyze(listValues) {
    var weather = crossfilter(listValues);
    var datedim = weather.dimension(function(d) {return d.Date;});
    //console.log(datedim);
    var description = weather.dimension(function(d) {return d.Description;});
    var description_total = description.group().reduceSum(function(d) {return 1;});
    var rain = description.filter("sky is clear");
    //print_filter(rain);
    //print_filter(description_total);
    //var weatherTable = dc.dataTable('#weatherTable');
    var weatherTypes = dc.pieChart('#weatherTypes');
    //weatherTable
    //.dat
    weatherTypes
    .width(300)
    .height(300)
    .dimension(description)
    .group(description_total)
    .innerRadius(60);
    dc.renderAll();
    //console.log(listValues[1].weather[0].description);
}

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 