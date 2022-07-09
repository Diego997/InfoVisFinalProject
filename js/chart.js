const updateTime = 800; // time for transitions
const margin = {top: 50, right: 20, bottom: 100, left: 40, text: 50, legend:100};
const width = 1350 - margin.left - margin.right - margin.legend;
const height = 460 - margin.top - margin.bottom - margin.text;

var dataSet = [];

var xScale = d3.scaleBand().rangeRound([2, width]).padding(.1);
var yScale = d3.scaleLinear().range([height, 0]);
var legendScale = d3.scaleLinear().range([height, 0]);
var barColors = d3.scaleLinear().range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
    "#f9d057","#f29e2e","#e76818","#d7191c"]);
var yAxis = d3.axisLeft(yScale).ticks(10);
var xAxis = d3.axisBottom(xScale)
var legendAxis = d3.axisRight(legendScale).ticks(10);// Left = ticks on the left
var publisher = "SEGA";
var devGen = 0;
yScale.domain([0, 100])
barColors.domain([0, 100 / 8, 200 / 8, 300 / 8, 400 / 8, 500 / 8, 600 / 8, 700 / 8, 100]);
legendScale.domain([0, 100]);

var svg1 = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right + margin.legend)     // i.e., 800 again
    .attr("height", height + margin.top + margin.bottom + margin.text)// i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function updateScaleDomain(pubb, devGen) {
    if (devGen==0) {
        var mapDevtoRev = publisherToDeveloper.get(pubb);
        var arr = Array.from(mapDevtoRev.keys())
        xScale.domain(arr.map(function (d) {return d}));
    }
    else {
        var mapDevtoRev = publisherToGenre.get(pubb);
        var arr = Array.from(mapDevtoRev.keys())
        xScale.domain(arr.map(function (d) {return d}));
    }
}

function updateAxes1(){
    svg1.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svg1.select("g.legend").transition().duration(updateTime).call(legendAxis);
    svg1.select("g.x.axis").transition().duration(updateTime).call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-55)");
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
        .attr("transform", "rotate(-55)");

    svg1.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width + margin.left) + ",0)")
        .call(legendAxis);

// Y axis label:
    svg1.append("text")
        .attr("text-anchor", "end")
        .attr("y", -25)
        .attr("x", margin.left+100)
        .attr("fill","white")
        .text("% Positive Reviews")
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
        .attr("x", width + 10)
        .attr("y", 0)
        .style("fill", "url(#linear-gradient)")
}

function updateDataset(pubb, devGen){
    console.log(publisherToDeveloper)
    if (devGen==0) {
        dataSet = Array.from(publisherToDeveloper.get(pubb), ([name, value]) => ([name, Math.round(value[0]/value[1])]))
    }
    else {
        dataSet = Array.from(publisherToGenre.get(pubb), ([name, value]) => ([name, Math.round(value[0]/value[1])]))
    }
}

function updateDrawing1(){
    console.log(dataSet)
    var bars = svg1.selectAll(".bar").data(dataSet, function (d) {return d[0]});

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth() )
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})
        .attr("stroke-width", 2)
        .attr("stroke", "white")


    bars.transition().duration(updateTime)
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth() )
        .attr("height", function(d) { return height- yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[1]);})
        .attr("stroke-width", 2)
        .attr("stroke", "white")
}

function redraw() {
    updateAxes1();
    updateDrawing1();
}



