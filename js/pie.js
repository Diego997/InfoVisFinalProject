// constants
const piewidth = 1300
const pieheight = 300
const piemargin = 60
const textheight = 700
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
    .innerRadius(50)
    .outerRadius(radius)

var svgText = d3.select("#pietext").append("svg")
    .attr("width", piewidth)
    .attr("height", textheight)
    .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")")

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
        .attr("y", -120)
        .attr("x", -640)
        .attr("fill", "white")
        .style("font-size", 25)
        .text(pub)

    svgPie.append("text")
        .attr("class", "sideTest")
        .attr("y", 130)
        .attr("x", -640)
        .attr("fill", "white")
        .style("font-size", 20)
        .text("avg postive reviews in " + year)
}

function gameTextUpdate() {
    var games = publisherYearToGame.get((pub+year))
    y = -80

    svgText.append("text")
        .attr("class", "gameText")
        .attr("y", -120)
        .attr("x", -300)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Developer")

    svgText.append("text")
        .attr("class", "gameText")
        .attr("y", -120)
        .attr("x", 270)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Genre")

    svgText.append("text")
        .attr("class", "gameText")
        .attr("y", -120)
        .attr("x", 500)
        .attr("fill", "cornflowerblue")
        .style("font-size", 20)
        .text("Positive Reviews")



    if (games) {
        for (g of games) {

            console.log(g)
            console.log(g[0])
            console.log(g[1])
            console.log(g[2])

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", y)
                .attr("x", -300)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[0])

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", y)
                .attr("x", 270)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[1])

            svgText.append("text")
                .attr("class", "gameText")
                .attr("y", y)
                .attr("x", 550)
                .attr("fill", "white")
                .style("font-size", 20)
                .text(g[2] + "%")

            y += 30
        }
    }

}

function updatePie() {

    d3.selectAll(".empty").remove()
    d3.selectAll(".numeroPercentile").remove()
    d3.selectAll(".sideTest").remove()
    d3.selectAll(".gameText").remove()
    svgPie.selectAll("path").remove()

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
        .attr('transform', 'translate(-520, 0)')
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
            .attr('transform', 'translate(-550, 10)')
            .attr("fill", "#90eb9d")
            .style("font-size", 30)

        centralText.text(d3.format(".0%")(percentage / 100))
    }
    else {
        svgPie.append("text")
            .attr("class", "empty")
            .attr("y", 20)
            .attr("x", -100)
            .attr("fill", "cornflowerblue")
            .style("font-size", 50)
            .text("No Data")
    }

}