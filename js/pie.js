// constants
const piewidth = 1300
const pieheight = 300
const piemargin = 20
const radius = Math.min(piewidth, pieheight) / 2 - piemargin
const updatePieTime = 800
const color = d3.scaleOrdinal().range(["#d7191c","#90eb9d","cornflowerblue"])

// variables
var year = "2019" // starting year
var pieColor      // starting pieColor
var percentage
var dataPie
var pie = d3.pie().value(d=>d[1])

// piechart initialization
var svgPie = d3.select("#piechart").append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
    .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")")

var arc = d3.arc()
    .innerRadius(70)
    .outerRadius(radius)

//functions
function updatePieValues() {
    var sumCount = publisherYearToReviews.get((pub+year))

    if (sumCount) {
        percentage = parseInt(sumCount[0]/sumCount[1])
        dataPie = pie(Object.entries([(100-percentage), percentage]))
        pieColor = 0
    }
    else{
        dataPie = pie(Object.entries([100, 0]))
        pieColor = 2
    }
    updatePie()
}

function sideTextUpdate() {

    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", -50)
        .attr("x", -640)
        .attr("fill", "white")
        .style("font-size", 35)
        .text(pub)

    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", 0)
        .attr("x", -640)
        .attr("fill", "white")
        .style("font-size", 35)
        .text("average positive")

    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", 50)
        .attr("x", -640)
        .attr("fill", "white")
        .style("font-size", 35)
        .text("reviews in " + year)
}

function updatePie() {


    d3.selectAll(".empty").remove()
    d3.selectAll(".numeroPercentile").remove()
    d3.selectAll(".sideTest").remove()
    svgPie.selectAll("path").remove()

    sideTextUpdate()

    svgPie.selectAll('path')
        .data(dataPie)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[pieColor]))
        .attr("stroke-width", 3)
        .attr("stroke", "cornflowerblue")
        .attr('transform', 'translate(0, 0)')
        .transition()
        .duration(updatePieTime)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d);
            }
        })

    if (pieColor == 0) {
        var centralText = svgPie.append("text")
            .attr("class", "numeroPercentile")
            .attr("y", 20)
            .attr("x", -45)
            .attr("fill", "#90eb9d")
            .style("font-size", 50)

        centralText.text(d3.format(".0%")(percentage / 100))
    }
    else {
        svgPie.append("text")
            .attr("class", "empty")
            .attr("y", 20)
            .attr("x", +200)
            .attr("fill", "cornflowerblue")
            .style("font-size", 50)
            .text("No Data")
    }

}