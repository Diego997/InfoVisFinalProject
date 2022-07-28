// constants
const updateTime = 800; // time for transitions
const margin = {top: 50, right: 20, bottom: 100, left: 40, text: 50, legend:100};
const width = 1350 - margin.left - margin.right - margin.legend;
const height = 460 - margin.top - margin.bottom - margin.text;
const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
const legendScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
const barColors = d3.scaleLinear()
    .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c", "#f9d057","#f29e2e","#e76818","#d7191c"])
    .domain([0, 100 / 8, 200 / 8, 300 / 8, 400 / 8, 500 / 8, 600 / 8, 700 / 8, 100]);

// variables
var dataBar = [];
var xScale = d3.scaleBand().rangeRound([2, width]).padding(.1);
var yAxis = d3.axisLeft(yScale).ticks(10);
var xAxis = d3.axisBottom(xScale)
var legendAxis = d3.axisRight(legendScale).ticks(10);// Left = ticks on the left

// barchart initialization
var svgBar = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right + margin.legend)     // i.e., 800 again
    .attr("height", height + margin.top + margin.bottom + margin.text)// i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//function
function shadeColor(color) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (85) / 100);
    G = parseInt(G * (85) / 100);
    B = parseInt(B * (85) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function updateScaleDomain(){
    if (devGen==0) {
        var mapDevtoRev = publisherToDeveloper.get(pub);
        var arr = Array.from(mapDevtoRev.keys())
        xScale.domain(arr.map(function (d) {return d}));
    }
    else {
        var mapGentoRev = publisherToGenre.get(pub);
        var arr = Array.from(mapGentoRev.keys())
        xScale.domain(arr.map(function (d) {return d}));
    }
}

function updateAxes(){
    svgBar.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svgBar.select("g.legend").transition().duration(updateTime).call(legendAxis);
    svgBar.select("g.x.axis").transition().duration(updateTime).call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-55)");
}

function drawAxes(){

    svgBar.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svgBar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-55)");

    svgBar.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width + margin.left) + ",0)")
        .call(legendAxis);

// Y axis label:
    svgBar.append("text")
        .attr("text-anchor", "end")
        .attr("y", -25)
        .attr("x", margin.left+100)
        .attr("fill","white")
        .text("% Positive Reviews")
}

function drawLegend(){
    var linearGradient = svgBar.append("linearGradient")
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

    svgBar.append("rect")
        .attr("width", 30)
        .attr("height", height)
        .attr("x", width + 10)
        .attr("y", 0)
        .style("fill", "url(#linear-gradient)")
}

// create tooltip element
const tooltip = d3.select("body")
    .append("div")
    .attr("class","d3-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "15px")
    .style("background", "rgba(0,0,0,0.6)")
    .style("border-radius", "5px")
    .style("color", "#fff")
    .text("a simple tooltip");

function updateDataset(){
    if (devGen==0) {
        dataBar = Array.from(publisherToDeveloper.get(pub), ([name, value]) => ([name, Math.round(value[0]/value[1])]))
    }
    else {
        dataBar = Array.from(publisherToGenre.get(pub), ([name, value]) => ([name, Math.round(value[0]/value[1])]))
    }
}

function updateDrawing(){
    var bars = svgBar.selectAll(".bar").data(dataBar, function (d) {return d[0]});

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
        .on("mouseover", function() {

            var devString = this.__data__[0]

            var tooltipString = ""

            var key = pub + devString

            var yearList = developerToYear.get(key)
            yearList.sort()

            yearList1 = new Set(yearList)
            for (elem of yearList1) {
                tooltipString = tooltipString + elem
                tooltipString = tooltipString + "<br>";
            }

            tooltip.html(tooltipString).style("visibility", "visible");
            d3.select(this)
                .style("opacity", .5)
        })
        .on("mousemove", function(){
            tooltip
                .style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            tooltip.html(``).style("visibility", "hidden");
            d3.select(this)
                .style("opacity", 1)
        });



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

function redraw(){
    updateScaleDomain();
    updateAxes();
    updateDataset();
    updateDrawing();
    updatePieValues();
}