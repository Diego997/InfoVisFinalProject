// constants
const piewidth = 300
const pieheight = 300
const piemargin = 60
const textwidth = 1000
const textfixedheight = 50
const textfixedwidth = 1000
const radius = Math.min(piewidth, pieheight) / 2 - piemargin
const updatePieTime = 800
const color = d3.scaleOrdinal().range(["#d7191c","#90eb9d","cornflowerblue"])

// variables
var textheight = 200
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
    .innerRadius(50)
    .outerRadius(radius)

// text initialization
var svgTextFixed = d3.select("#pietextfixed").append("svg")
    .attr("width", textfixedwidth)
    .attr("height", textfixedheight)
    .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")")


var svgText = d3.select("#pietext").append("svg").attr("id","svgText")
    .attr("width", textwidth)
    .attr("height", textheight)
    .append("g")
    .attr("transform", "translate(" + piewidth / 2 + ",100)")

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

function textFixedInitialization() {
    svgTextFixed.append("text")
        .attr("class", "gameText")
        .attr("x", -150)
        .attr("y", -120)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Developer(s)")

    svgTextFixed.append("text")
        .attr("class", "gameText")
        .attr("y", -120)
        .attr("x", 460)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Genre(s)")

    svgTextFixed.append("text")
        .attr("class", "gameText")
        .attr("y", -120)
        .attr("x", 680)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Positive Reviews")
}

function sideTextUpdate() {
    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", -120)
        .attr("x", -140)
        .attr("fill", "white")
        .style("font-size", 25)
        .text(pub)

    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", 130)
        .attr("x", -140)
        .attr("fill", "white")
        .style("font-size", 23)
        .text("Positive Reviews in " + year)
}

function gameTextUpdate() {
    var games = publisherYearToGame.get((pub+year))
    if (games==undefined)
        textheight = 200
    else
        textheight = games.length * 31
    document.getElementById("svgText").setAttribute("height",textheight)
    yPosition = -80

    if (games) {
        for (g of games) {

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", yPosition)
                .attr("x", -150)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[0])

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", yPosition)
                .attr("x", 460)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[1])

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", yPosition)
                .attr("x", 740)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[2] + "%")

            yPosition += 30
        }
    }

}

function updatePie() {

    d3.selectAll(".empty").remove()
    d3.selectAll(".numeroPercentile").remove()
    d3.selectAll(".sideTest").remove()
    d3.selectAll(".gameText").remove()
    svgPie.selectAll("path").remove()

    textFixedInitialization()
    sideTextUpdate()
    gameTextUpdate()

    svgPie.selectAll('path')
        .data(dataPie)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[pieColor]))
        .attr("stroke-width", 3)
        .attr("stroke", "cornflowerblue")
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
            .attr('transform', 'translate(-25, 10)')
            .attr("fill", "#90eb9d")
            .style("font-size", 30)

        centralText.text(d3.format(".0%")(percentage / 100))
    }
    else {
        svgText.append("text")
            .attr("class", "empty")
            .attr("y", 20)
            .attr("x", -100)
            .attr("fill", "cornflowerblue")
            .style("font-size", 50)
            .text("No Data")
    }

}