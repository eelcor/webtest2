'use strict';
var weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=Markelo,nl&mode=json&units=metric';
var weatherUrl2 = 'http://api.openweathermap.org/data/2.5/forecast?q=Leiden,nl&mode=json&units=metric';

//var datasource = [];
generateChart(weatherUrl,'Markelo');

$('#push1').click(function() {
    if ($('#push1').hasClass('btn-primary')) {
        updateChart(weatherUrl,'Markelo');
        $('#push1').removeClass('btn-primary');
    } else {
        updateChart(weatherUrl2,'Leiden');
        $('#push1').addClass('btn-primary');
    }
});

// This is the graph
function marginGraph(minmax) {
    var center,delta;
    center = (minmax[0]+minmax[1])/2;
    delta = center-minmax[0];
    return [center-1.5*delta, center+1.5*delta];
}
    
function generateChart(url, city) {
    var datasource = [];
    var tmpdate,tmpdata,tmpdata2;
    var margin = {top: 20, right: 20, bottom: 60, left: 50}, width = 400 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
    
    var x = d3.time.scale()
    .range([0,width]);
    var y1 = d3.scale.linear()
    .range([height,0]);
    var y2 = d3.scale.linear()
    .range([height,0]);
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
    var yAxis1 = d3.svg.axis()
    .scale(y1)
    .orient('left');
    var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient('left');
    
    var line1 = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {return x(d.Date);})
    .y(function(d) {return y1(d.Value1);});
    
    var line2 = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {return x(d.Date);})
    .y(function(d) {return y2(d.Value2);});
    
    var svg = d3.select('#graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');
    
    svg.append('text')
    .attr('id','graphTitle')
    .style('text-anchor','middle')
    .style('font-size','20px')
    .attr('transform','translate('+(width/2)+',0)')
    //.attr('dy','-.15em')
    .text(city);

    d3.json(url,
        function(error, response) {
            var object;
            for(object in response.list){
                //console.log(object);
                tmpdate = new Date(response.list[object].dt*1000);
                tmpdata = response.list[object].main.pressure;
                tmpdata2 = response.list[object].main.temp;
                datasource.push({'Date':tmpdate,'Value1':tmpdata, 'Value2':tmpdata2});
            }
        x.domain(d3.extent(datasource, function(d) { return d.Date; }));
        y1.domain(marginGraph(d3.extent(datasource, function(d) { return d.Value1; })));
        y2.domain(marginGraph(d3.extent(datasource, function(d) {return d.Value2; })));
        
        var axesSelection = svg.append('g').attr('id','axes');
        axesSelection.append('g')
        .attr('id','xAxis')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+ height + ')')
        .call(xAxis)
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');
        
        axesSelection.append('g')
        .attr('id','yAxis1')
        .attr('class', 'y axis')
        .call(yAxis1)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 5)
        .attr('dy', '.71em')
        .style('text-anchor','end')
        .text('Pressure (mBar)');
        
        axesSelection.append('g')
        .attr('id','yAxis2')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + width + ',0)')
        .call(yAxis2);
        
        axesSelection.append('g')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', width+5)
        .attr('dy', '.71em')
        .style('text-anchor','end')
        .text('Temperature (\u2103)');
        
        var graphLine1 = svg.append('g');
        var graphLine2 = svg.append('g');
        graphLine1.append('path')
        .datum(datasource)
        .attr('id','Line1')
        .attr('class', 'line')
        .attr('d', line1);
        
        graphLine2.append('path')
        .datum(datasource)
        .attr('id','Line2')
        .attr('class','line2')
        .attr('d', line2);
        
        var scatter1selection = svg.append('g').attr('id','scatter1');
        var scatter2selection = svg.append('g').attr('id','scatter2');
        scatter1selection.selectAll('circle')
        .data(datasource)
        .enter()
        .append('circle')
        .attr('id','circle1')
        .attr('class', 'circle1')
        .attr('cx', function(d) {
            return x(d.Date);
        })
        .attr('cy', function(d) {
            return y1(d.Value1);
        })
        .attr('r', 3)
        .on('mouseover', function(d) {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('r',5);
            //d3.select('#valueX').text('<h2>Selected</h2>');
            document.getElementById('valueX').innerHTML = '<h2>'+d.Date+'</h2>';
            document.getElementById('valueY').innerHTML = '<h2>'+d.Value1+' mBar</h2>';
        })
        .on('mouseout', function() {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('r',3);
        });
        
        scatter2selection.selectAll('circle')
        .data(datasource)
        .enter()
        .append('circle')
        .attr('id','circle2')
        .attr('class', 'circle2')
        .attr('cx', function(d) {
            return x(d.Date);
        })
        .attr('cy', function(d) {
            return y2(d.Value2);
        })
        .attr('r', 3)
        .on('mouseover', function(d) {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('r',5);
            document.getElementById('valueX').innerHTML = '<h2>'+d.Date+'</h2>';
            document.getElementById('valueY').innerHTML = '<h2>'+d.Value2+' \u2103</h2>';
        })
        .on('mouseout', function() {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('r',3);
        });
});
}
            
function updateChart(url,city) {
        var datasource = [];
        var tmpdate,tmpdata,tmpdata2;
        var margin = {top: 20, right: 20, bottom: 60, left: 50}, width = 400 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
    
        var x = d3.time.scale()
    .range([0,width]);
    var y1 = d3.scale.linear()
    .range([height,0]);
    var y2 = d3.scale.linear()
    .range([height,0]);
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
    var yAxis1 = d3.svg.axis()
    .scale(y1)
    .orient('left');
    var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient('left');
    
    var line1 = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {return x(d.Date);})
    .y(function(d) {return y1(d.Value1);});
    
    var line2 = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {return x(d.Date);})
    .y(function(d) {return y2(d.Value2);});
    
    var svg = d3.select('#graph').selectAll('svg');
    svg.selectAll('#graphTitle')
        .transition()
        .duration(400)
        .text(city);
    
        d3.json(url,
        function(error, response) {
            var object;
            console.log(error);
            for(object in response.list){
                tmpdate = new Date(response.list[object].dt*1000);
                tmpdata = response.list[object].main.pressure;
                tmpdata2 = response.list[object].main.temp;
                datasource.push({'Date':tmpdate,'Value1':tmpdata, 'Value2':tmpdata2});
            }
        x.domain(d3.extent(datasource, function(d) { return d.Date; }));
        y1.domain(marginGraph(d3.extent(datasource, function(d) { return d.Value1; })));
        console.log(d3.extent(datasource, function(d) { return d.Date; }));
        y2.domain(marginGraph(d3.extent(datasource, function(d) {return d.Value2; })));
        
        d3.selectAll('#xAxis')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+ height + ')')
        .transition()
        .duration(400)
        .call(xAxis)
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');
        
        d3.selectAll('#yAxis1')
        .attr('class', 'y axis')
        .transition()
        .duration(400)
        .call(yAxis1);
        
        d3.selectAll('#yAxis2')
        .attr('class', 'y axis')
        .transition()
        .duration(400)
        .call(yAxis2);
        
        d3.select('#Line1')
        .transition()
        .duration(400)
        .attr('d', line1(datasource));
        
        d3.select('#Line2')
        .transition()
        .duration(400)
        .attr('d', line2(datasource));
        
        d3.selectAll('#scatter1')
        .selectAll('.circle1')
        .data(datasource)
        .enter();
        
        d3.selectAll('.circle1')
        .transition()
        .duration(400)
        .attr('cx', function(d) {
            return x(d.Date);
        })
        .attr('cy', function(d) {
            return y1(d.Value1);
        })
        .attr('r', 3);
        
        d3.selectAll('#scatter2')
        .selectAll('.circle2')
        .data(datasource)
        .enter();
                    
        d3.selectAll('.circle2')
        .transition()
        .duration(400)
        .attr('cx', function(d) {
            return x(d.Date);
        })
        .attr('cy', function(d) {
            return y2(d.Value2);
        })
        .attr('r', 3);
        });
    }

        