// anything to do with graph

const dims = {height:300, width:300, radius:150};
const cent = {x: (dims.width/2 + 5), y: (dims.height/2 +5)};

const svg = d3.select(".canvas")
    .append('svg')
    .attr('width', dims.width+150) //150 pixels for legend on right
    .attr('height', dims.height + 150) // room at the bottom

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

//generates angles
const pie = d3.pie() // returns a function
    .sort(null) // otherwise, re sorts data based on angles
    .value(d => d.cost) // data will be passed to pie at some point


const angles = pie([
    { name: 'rent', cost: 500 },
    { name: 'bills', cost: 300 },
    { name: 'gaming', cost: 200 }
]);

console.log(angles);

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius((dims.radius/2)); // needed for donus chart

console.log(arcPath(angles[0])) // pass an object with start angle and end angle to get the arc path

//M9.184850993605149e-15,-150A150,150,0,1,1,9.184850993605149e-15,150L4.592425496802574e-15,75A75,75,0,1,0,4.592425496802574e-15,-75Z

//ordinal scale
// colors in scale ["red", "blue", "green"]
//["bill", "sam", "henry"] ==> o("bill") = "red"


//const colour = d3.scaleOrdinal(['red', 'blue']) // pass in the output range of colors
const colour = d3.scaleOrdinal(d3['schemeSet3']); // or use d3  color schemes

//legend setup
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width +40},10)`)

const legend = d3.legendColor()
    .shape('circle') // shape of the legend key
    .shapePadding(10) //verticle space between each key
    .scale(colour)

//tool tip setup
const tip = d3.tip()
    .attr('class', 'd3-tip card') // card is materialize class to add style
    .html((e,d) => {
        // let is when a variables scope should be local
        let content = `<div class="name">${d.data.name}</div>`;
        content += `<div class="cost">${d.data.cost}</div>`;
        content += `<div class="delete">Click slice to delete</div>`;
        return content
    })

// attaches the data d
graph.call(tip);

d3.select('.d3-tip')
    .style('background', '#333')
    .style('color', '#fff');

//doesnt work here. put them in index.html or your own style sheet 

// d3.select('.delete')
//     .style('color', '#333')

//without d3 tip plug in, you can create your own div 
// const tip = d3
//   .select("body")
//   .append("div")
//   .attr("class", "card")
//   .style("padding", "8px") // Add some padding so the tooltip content doesn't touch the border of the tooltip
//   .style("position", "absolute") // Absolutely position the tooltip to the body. Later we'll use transform to adjust the position of the tooltip
//   .style("left", 0)
//   .style("top", 0)
//   .style("visibility", "hidden");

// add events
// graph
// .selectAll("path")
// .on("mouseover", (event, d) => {
//   let content = `<div class="name">${d.data.name}</div>`;
//   content += `<div class="cost">£${d.data.cost}</div>`;
//   content += `<div class="delete">Click slice to delete</div>`;
//   tip.html(content).style("visibility", "visible");
//   handleMouseOver(event, d);
//})

//change position of tool tip
// .on("mousemove", (event, d) => {
//     tip.style("transform", `translate(${event.pageX}px,${event.pageY}px)`); // We can calculate the mouse's position relative the whole page by using event.pageX and event.pageY.
//   })




// update data
const update = (data) => {
    console.log(data);

    //update color scale domain
    // map creates a new array based on current array
    colour.domain(data.map(d => d.name));
    legendGroup.call(legend);
    legendGroup.selectAll('text')
        .attr('fill', 'white')

    // join pie data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data));

    paths.exit()
        .transition().duration(1000)
        .attrTween('d', arcTweenExit)
        .remove();  // remove paths of deleted items. otherwise there will be an empty portion in the donut

    paths.attr('d', d => arcPath(d)) // d is pie(data)
     //.attr('fill',d => colour(d.data.name))
     .transition().duration(1000)
     .attrTween('d',arcTweenUpdate)

    paths.enter()
        .append('path')
        .attr('class','arc') // every path has a class arc
        //.attr('d', d => arcPath(d)) // or u can simply say arcPath. it automaticaly passes the data
        .attr('stroke', '#fff') //white store
        .attr('stroke-width', 2)
        .attr('fill',d => colour(d.data.name)) //d.name does not exist as pie(data) is passed. it is now in data property
        .each(function(d){ this._current = d}) // on each path element, apply the function. we use function keywork to allow use of "this" keyword. //._current is data before update.ii.e when it first enters the dom
        .transition().duration(1000)
            .attrTween("d",arcTweenEnter)

    // Add event listeners
    graph.selectAll('path')
        .on('mouseover', (e, d) => {
            tip.show(e,d);
            handleMouseOver(e,d);
        })
        .on('mouseout', (e,d) => {
            tip.hide();
            handleMouseOut(e,d);
        })
        .on('click', handleClick)

};

// create data listener
var data = [];
db.collection('expenses').onSnapshot(res => {
    
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(),id:change.doc.id};

        switch (change.type) {
            // get the keyword from change.doc
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id) // cycles through each item and returns the index of the item that matches the condition
                data[index] = doc;
                break;
            case 'removed':
                //filter: cycle through the data array and filter based on certain criteria
                data = data.filter(item => item.id !== doc.id); //True: remains in array, False: out of array
                break;
            default:
                break; //we need a default case if none of these match.
        }
        

    });

    update(data);
});

const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);
    return function(t){
       d.startAngle =  i(t)
       return arcPath(d);
    }
}

const arcTweenExit = (d) => {
    //swap start and end angle
    var i = d3.interpolate(d.startAngle, d.endAngle);
    return function(t){
       d.startAngle =  i(t)
       return arcPath(d);
    }
}

// use function keyword so that we can use this keyword inside the function to reference the current element
function arcTweenUpdate(d){

   // console.log(this._current, d); // current is data at the time of dom entry and d is the new data

   //interpolate two objects
   var i = d3.interpolate(this._current, d);
   
   //update the current data
   this._current = d; //or i(1)

   return function(t){
       return arcPath(i(t));
   }

}

//event handlers
//autonatically the current event and data are passed
const handleMouseOver = (e,d) => {
    //console.log(e.currentTarget);

    // on hover change color to white
    //name the transitions. otherwise, when the page is refreshed and you hoover over before the chart draw transitiono is complete, the chart will break.
    d3.select(e.currentTarget)
        .transition('changeSliceFill').duration(300) // name the transition so that they do not interfere with other transitioons
            .attr('fill', "#fff")

}

const handleMouseOut = (e,d) => {

    //reset the color when mouse hovers out
    d3.select(e.currentTarget)
        .transition('changeSliceFill').duration(300) // same name as as hover as they belong to same type
            .attr('fill', colour(d.data.name))

}

const handleClick = (e,d) => {
    //go to database and delete the slice
    console.log(d);
    const id = d.data.id;
    db.collection('expenses').doc(id).delete()
}