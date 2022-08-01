// variables
var pub = "2K";
var devGen = 0;
var devDataset = [];
var genDataset = [];
var compDataset = [];
var publisherToDeveloper = new Map();
var publisherYearToReviews = new Map();
var publisherToGenre = new Map();
var publisherYearToGame = new Map();
var developerToYear = new Map();
var genreToYear = new Map();

//functions
function mapPublisherToDeveloper() {
    for (elem of devDataset) {
        if ( publisherToDeveloper.has(elem[3]) ) {
            if ( publisherToDeveloper.get(elem[3]).has(elem[2]) ) {
                percentages = publisherToDeveloper.get(elem[3]).get(elem[2])[0] + parseInt(elem[0])
                grades = publisherToDeveloper.get(elem[3]).get(elem[2])[1] + 1
                publisherToDeveloper.get(elem[3]).set(elem[2], [percentages, grades])
            }
            else {
                publisherToDeveloper.get(elem[3]).set(elem[2], [parseInt(elem[0]), 1])
            }
        }
        else {
            val = new Map()
            val.set( elem[2], [parseInt(elem[0]), 1])
            publisherToDeveloper.set(elem[3], val);
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
    console.log(publisherYearToReviews)
}

function mapPublisherYearToGame() {
    for (elem of compDataset) {
        var key = elem[3]+elem[1]
        if (publisherYearToGame.has(key)) {
            arr = publisherYearToGame.get(key)
            arr.push([elem[2], elem[4], parseInt(elem[0])])
            publisherYearToGame.set(key, arr);
        } else {
            publisherYearToGame.set(key, [[elem[2], elem[4], parseInt(elem[0])]]);
        }
    }
}

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

function mapDeveloperToYear() {
    for (elem of devDataset) {
        var key = elem[3]+elem[2]
        if (developerToYear.has(key)) {
            arr = developerToYear.get(key)
            arr.push(elem[1])
            developerToYear.set(key, arr);
        } else {
            developerToYear.set(key, [elem[1]]);
        }
    }
}

function mapGenreToYear(){
    for (elem of genDataset) {
        var key = elem[3]+elem[4]
        if (genreToYear.has(key)) {
            arr = genreToYear.get(key)
            arr.push(elem[1])
            genreToYear.set(key, arr);
        } else {
            genreToYear.set(key, [elem[1]]);
        }
    }
}

function generateMap(){
    mapPublisherToGenre();
    mapPublisherYearToReviews();
    mapPublisherYearToGame();
    mapPublisherToDeveloper();
    mapDeveloperToYear();
    mapGenreToYear();
}

function switchDevGen(a){
    devGen=a;
    redraw();
}

function updateYear(a){
    year=a;
    updatePieValues();
}

function updatePub(a){
    pub=a;
    redraw();
}

function startUp(){
    updateScaleDomain();
    updateDataset();
    drawLegend();
    drawAxes();
    updateDrawing();
    updatePieValues();
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
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });

d3.json("data/devDataset.json")
    .then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            devDataset.push(arr);
        });
        generateMap();
        setTimeout(startUp,20);
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });