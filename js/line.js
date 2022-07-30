const marginLine = {top: 50, right: 20, bottom: 30, left: 30, legend:100};
const widthLine = 1800 - marginLine.left - marginLine.right - marginLine.legend;
const heightLine = 800 - marginLine.top - marginLine.bottom ;
const myColor = d3.scaleOrdinal()
    .domain(dataLine.map(function (d) {return d[0]}))
    .range(["#C71585", "#FFC0CB", "#FF1493", "#E6E6FA", "#483D8B", "#FFA07A", "#DC143C", "#8B0000", "#FFA500", "#FFD700", "#FFE4B5", "#BDB76B", "#32CD32", "#9ACD32", "#66CDAA", "#1E90FF"]);

var svgLine = d3.select("#linechart").append("svg")
    .attr("width", widthLine + marginLine.left + marginLine.right + marginLine.legend)     // i.e., 800 again
    .attr("height", heightLine + marginLine.top + marginLine.bottom )// i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

// Add X axis --> it is a date format
const x = d3.scaleBand().rangeRound([2, widthLine-marginLine.legend]).padding(1)
    .domain([2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019]);


// Add Y axis
const y = d3.scaleLinear()
    .domain([20,100])
    .range([ heightLine, 0 ]);

svgLine.append("g")
    .attr("transform", `translate(0, ${heightLine})`)
    .attr("fill","white")
    .call(d3.axisBottom(x));

svgLine.append("g")
    .attr("fill","white")
    .call(d3.axisLeft(y));

var sizeRect = 20

function drawLine() {
    const line = d3.line()
        .x(d => x(+d[0]))
        .y(d => y(+d[1]))
    svgLine.selectAll("myLines")
        .data(dataLine)
        .join("path")
        .attr("d", d => line(d[1]))
        .attr("stroke", d => myColor(d[0]))
        .style("stroke-width", 2)
        .style("fill", "none")
    svgLine
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataLine)
        .join('g')
        .style("fill", d => myColor(d[0]))
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(d => d[1])
        .join("circle")
        .attr("cx", d => x(d[0]))
        .attr("cy", d => y(d[1]))
        .attr("r", 2)
        .attr("stroke", "white")

   /* // Add a legend at the end of each line
    svgLine
        .selectAll("myLabels")
        .data(dataLine)
        .join('g')
        .append("text")
        .datum(d => { return [d[0],  d[1][d[1].length - 1]]; }) // keep only the last value of each time series
        .attr("transform",d => `translate(${x(d[1][0])},${y(d[1][1])})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d[0])
        .style("fill", d => myColor(d[0]))
        .style("font-size", 15)
*/
    var pubKeys = dataLine.map(function (d){return d[0]} ).sort()
    svgLine.selectAll("myrects")
        .data(dataLine)
        .enter()
        .append("rect")
        .attr("x", 1550)
        .attr("y", function(d,i){ return 0 + i*(sizeRect+25)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", sizeRect)
        .attr("height", sizeRect)
        .style("fill", function(d){ return myColor(d[0])})

// Add one dot in the legend for each name.
    svgLine.selectAll("mylabels")
        .data(pubKeys)
        .enter()
        .append("text")
        .attr("x", 1550 + sizeRect*1.2)
        .attr("y", function(d,i){ return 0 + i*(sizeRect+25) + (sizeRect/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d[0])})
        .text(function(d){ return d[0]})
        .attr("text-anchor", "left")
        .style("font-size", 18)
        .style("alignment-baseline", "middle")
        .on("click", function(event,d){
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d[0]).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d[0]).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
}

