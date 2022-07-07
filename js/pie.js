var piewidth = 1300
var pieheight = 300
var piemargin = 20
var radius = Math.min(piewidth, pieheight) / 2 - piemargin
var pub = "Paradox Interactive"
var year = "2018"
var svg = d3.select("#div2").append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight)
    .append("g")
    .attr("transform", "translate(" + piewidth / 2 + "," + pieheight / 2 + ")");

function updateYear(a){
    year = a;
}

function updatePub(a){
    pub = a;
}

var aa = 50;

function cartaCanta() {
    var percentagesss = publisherToDeveloper.get(pub)
    console.log(percentagesss)
    var aa = percentagesss[1]
}


var data = {a: (100-aa), b: aa}

var color = d3.scaleOrdinal()
    .range(["#d7191c","#90eb9d"])

var pie = d3.pie()
    .value(d=>d[1])

var data_ready = pie(Object.entries(data))
function evincesanremo() {
    svg.selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(70)         // This is the size of the donut hole
            .outerRadius(radius)
        )
        .attr('fill', d => color(d.data[0]))
        .attr("stroke-width", 1)
        .attr("stroke", "white")
}
var centralText = svg.append("text")
    .attr("y", 16)
    .attr("x", -45)
    .attr("fill","#90eb9d")
    .style("font-size", 50);

centralText.text(d3.format(".0%")(.7));
