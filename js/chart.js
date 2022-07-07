const updateTime = 800; // time for transitions
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 1200 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;
const ldmargin = 100;
const nBars=10;
const posFirstBar=(width/nBars/10)+2;
const posOtherBars=(width-2)/nBars;
const posLegend = {from: Math.trunc((posOtherBars*2)+(posFirstBar)+(posOtherBars/2))-5,
    to: Math.trunc((posOtherBars*7)+(posFirstBar)+(posOtherBars/2))-9};

var dataSet = [];
var xScale = d3.scaleBand().rangeRound([2, width-ldmargin]).padding(.1);
var yScale = d3.scaleLinear().range([height, 0]);
var legendScale = d3.scaleLinear().range([height, 0]);
var barColors = d3.scaleLinear().range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
    "#f9d057","#f29e2e","#e76818","#d7191c"]);
var yAxis = d3.axisLeft(yScale).ticks(10);
var xAxis = d3.axisBottom(xScale)
var legendAxis = d3.axisRight(legendScale).ticks(10);// Left = ticks on the left

var svg1 = d3.select("#div1").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)// i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#div2").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function updateXScaleDomain() {
    xScale.domain(dataSet.map(function(d) { return d[2]}));
}

function updateYScaleDomain(){
    yScale.domain([0, d3.max(dataSet, function(d) { return d[1]; })]);
}

function updateColorScaleDomain(){
    var max=d3.max(dataSet, function(d){ return d[1];})
    barColors.domain([0,max*1/8,max*2/8,max*3/8,max*4/8,max*5/8,max*6/8,max*7/8,max]);
}

function updateLegendScaleDomain(){
    legendScale.domain([0, d3.max(dataSet, function(d) { return d[1]; })]);
}

function updateAxes1(){
    svg1.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svg1.select("g.legend").transition().duration(updateTime).call(legendAxis);
    svg1.select("g.x.axis").transition().duration(updateTime).call(xAxis);
}

function drawAxes1(){

    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg1.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(1100,0)")
        .call(legendAxis);

}

function drawLegend1(){
    var linearGradient = svg1.append("linearGradient")
        .attr("id","linear-gradient");
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    linearGradient.selectAll("stop")
        .data([
            {offset: "0%", color: "#2c7bb6"},
            {offset: "12.5%", color: "#00a6ca"},
            {offset: "25%", color: "#00ccbc"},
            {offset: "37.5%", color: "#90eb9d"},
            {offset: "50%", color: "#ffff8c"},
            {offset: "62.5%", color: "#f9d057"},
            {offset: "75%", color: "#f29e2e"},
            {offset: "87.5%", color: "#e76818"},
            {offset: "100%", color: "#d7191c"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg1.append("rect")
        .attr("width", 30)
        .attr("height", height)
        .attr("x", 1070)
        .attr("y", 0)
        .style("fill", "url(#linear-gradient)")
}

function updateDrawing1(){
    var bars = svg1.selectAll(".bar").data(dataSet, function(d){return d});

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[2]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth() )
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})
        .attr("stroke-width", 2)
        .attr("stroke", "white")


    bars.transition().duration(updateTime)
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[2]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth() )
        .attr("height", function(d) { return height- yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})
        .attr("stroke-width", 2)
        .attr("stroke", "white")

}

function redraw() {
    updateYScaleDomain();
    updateColorScaleDomain();
    updateLegendScaleDomain();
    updateAxes1();
    updateAxes2();
    updateDrawing1();
    updateDrawing2();
}

function drawAxes2(){

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis);

    svg2.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(1100,0)")
        .call(legendAxis);
}


function updateAxes2(){
    svg2.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svg2.select("g.legend").transition().duration(updateTime).call(legendAxis);
    svg2.select("g.x.axis").transition().duration(updateTime).call(xAxis);
}

function drawLegend2(){

    svg2.append("rect")
        .attr("width", 30)
        .attr("height", height)
        .attr("x", 1070)
        .attr("y", 0)
        .style("fill", "url(#linear-gradient)")
}

function updateDrawing2(){
    var bars = svg2.selectAll(".bar").data(dataSet, function(d){return d});

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("stroke-width", 2)
        .attr("stroke", "white")
        .attr("x", function(d) { return xScale(d[2]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})


    bars.transition().duration(updateTime)
        .attr("class", "bar")
        .attr("stroke-width", 2)
        .attr("stroke", "white")
        .attr("x", function(d) { return xScale(d[2]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})

}

var buttons = d3.selectAll('input')
buttons.on('change', handleClick)

function handleClick(){
    for(elem of dataSet){
        var swap1 = elem[0]
        var swap0 = elem[1]
        elem[1] = swap1
        elem[0] = swap0
    }
    redraw()
}


var datasetSteam = [];

var publisherToDeveloper = new Map();

var publisherYearToDeveloper = new Map();

var publisherToGenre = new Map();

var publisherYearToGenre = new Map();

console.log(datasetSteam);

function mapPublisherToDeveloper() {
    for (elem of datasetSteam) {
        if (publisherToDeveloper.has(elem[3])) {
            arr = publisherToDeveloper.get(elem[3])
            arr.push(elem[2])
            publisherToDeveloper.set(elem[3], arr);
        } else
            arr=[elem[2]];
            var uniqueArr = [...new Set(arr)]
            publisherToDeveloper.set(elem[3],uniqueArr);
    }
}

function mapPublisherYearToDeveloper() {
    for (elem of datasetSteam) {
        if (publisherYearToDeveloper.has([elem[3],elem[1]])) {
            arr = publisherYearToDeveloper.get([elem[3],elem[1]])
            arr.push(elem[2])
            publisherYearToDeveloper.set([elem[3],elem[1]], arr);
        } else
            arr=[elem[2]];
        var uniqueArr = [...new Set(arr)]
        publisherYearToDeveloper.set([elem[3],elem[1]],uniqueArr);
    }
}

function mapPublisherToGenre() {
    for (elem of datasetSteam) {
        if (publisherToGenre.has(elem[3])) {
            arr = publisherToGenre.get(elem[3])
            arr.push(elem[4])
            publisherToGenre.set(elem[3], arr);
        } else
            arr=[elem[2]];
        var uniqueArr = [...new Set(arr)]
        publisherToGenre.set(elem[3],uniqueArr);
    }
}

function mapPublisherYearToGenre() {
    for (elem of datasetSteam) {
        if (publisherYearToGenre.has([elem[3],elem[1]])) {
            arr = publisherYearToGenre.get([elem[3],elem[1]])
            arr.push(elem[4])
            publisherYearToGenre.set([elem[3],elem[1]], arr);
        } else
            arr=[elem[2]];
        var uniqueArr = [...new Set(arr)]
        publisherYearToGenre.set([elem[3],elem[1]],uniqueArr);
    }
}

console.log(publisherToDeveloper);
console.log(publisherYearToDeveloper);
console.log(publisherToGenre);
console.log(publisherYearToGenre);


d3.json("data/completeDataset.json")
    .then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            datasetSteam.push(arr);
        });
        mapPublisherToDeveloper();
        mapPublisherYearToDeveloper();
        mapPublisherToGenre();
        mapPublisherYearToGenre();
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });

d3.json("data/dataset.json")
	.then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            dataSet.push(arr);
        });
        updateYScaleDomain();
        updateXScaleDomain();
        updateColorScaleDomain();
        updateLegendScaleDomain()
        drawLegend1();
        drawAxes1();
    	updateDrawing1();
        drawLegend2();
        drawAxes2();
        updateDrawing2();
   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});

