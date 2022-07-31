var dataLine = [];
var compDataset = [];
var genDataset = [];
var publisherYearToReviews = new Map();
var publisherToGenre = new Map();

function mapPublisherToGenre() {
    for (elem of genDataset) {
        if ( publisherToGenre.has(elem[3]) ) {
            if ( publisherToGenre.get(elem[3]).has(elem[4]) ) {
                percentages = publisherToGenre.get(elem[3]).get(elem[4])[0] + parseInt(elem[0])
                grades = publisherToGenre.get(elem[3]).get(elem[4])[1] + 1
                publisherToGenre.get(elem[3]).set(elem[4], [percentages, grades])
            }
            else {
                publisherToGenre.get(elem[3]).set(elem[4], [parseInt(elem[0]), 1])
            }
        }
        else {
            val = new Map()
            val.set( elem[4], [parseInt(elem[0]), 1])
            publisherToGenre.set(elem[3], val);
        }
    }
}

function mapPublisherYearToReviews() {
    for (elem of compDataset) {
        var key = elem[3]+elem[1]
        if (publisherYearToReviews.has(key)) {
            sum = publisherYearToReviews.get(key)[0]+parseInt(elem[0])
            count = publisherYearToReviews.get(key)[1]+1
            publisherYearToReviews.set(key, [sum,count]);
        } else {
            publisherYearToReviews.set(key, [parseInt(elem[0]),1]);
        }
    }
}

function createDataLine(){
    for(publ of publisherToGenre.keys()){
        var yearReviews=[];
        var year = "2000";
        while(parseInt(year)<2020){
            val=publisherYearToReviews.get(publ+year)
            if(val!==undefined){
                var couple = val
                avg = couple[0]/couple[1]
                yearReviews.push([year, Math.round(avg)])
            }
            num=parseInt(year)+1
            year=num.toString();
        }
        dataLine.push([publ,yearReviews])
    }
}

d3.json("data/genDataset.json")
    .then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            genDataset.push(arr);
        });
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });

d3.json("data/compDataset.json")
    .then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            compDataset.push(arr);
        });
        mapPublisherToGenre();
        mapPublisherYearToReviews();
        createDataLine();
        drawLine();
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });