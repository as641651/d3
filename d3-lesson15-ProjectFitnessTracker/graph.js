//4. preparation that doesnt depend on data

const svgWidth = 560
const svgHeight = 400

//margins for space around the graph
const margin = {top:40, right:20, bottom:50, left:100}

//560 is svg container width
const graphWidth = svgWidth - margin.left - margin.right;
const graphHeight = svgHeight - margin.top - margin.bottom;

//append svg container to index file
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', svgWidth )
    .attr('height', svgHeight );

//create group for graph element
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.right})`);


 //5. Create ranges for Scales
// y: domain: [0, max distance], range: [grapph height,0] 
// x: domain: [earliest date, latest date], range: [0, graphWidth]

const x = d3.scaleTime().range([0,graphWidth]);
const y = d3.scaleLinear().range([graphHeight,0]);

//axis groups:
const xAxisGroup = graph.append('g')
    .attr('class','x-axis') // just in case to style it later on
    .attr('transform', "translate(0, " + graphHeight + ") ");
const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')


// svg.append("text")
// 	.text("(m)")
//     .attr('font-size', '12px')
// 	.attr("x", 0)
// 	.attr("y", graphHeight/2)
//     .attr('fill', 'white');

//10. Line path generator
const line = d3.line()
    .x(function(d){return x(new Date(d.date))})
    .y(function(d){return y(d.distance)});

// path element that ll be updated based on data
const path = graph.append('path');

//15.dotted lines. Why create a group? Becuse we we want to control the opacity of the whole group
const dottedLines = graph.append('g')
    .attr('class', 'lines')
    .style('opacity',0);

const xDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4);

const yDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4);

 
//2. update function: set up data pipeline

const update = (data) => {
    //console.log(data)


    //9. Filter the data based on current selected activity
    // this is local data passed on to this function
    //'activity' variable is from index.js
    data = data.filter(item=> item.activity == activity)

    //13. Sort the data
    // take two consequtive element, and if eval is -ve and swapped. the call back function is the comparison function
    // NOTE: Bad Idea to sort in the front end
    data.sort((a,b) => new Date(a.date) - new Date(b.date))


    //3. Now create the graph and axis group: now outside the update function


    //6. Back to update function: domain for axis

    //extent: for every d in data do the operation defined by the call back function and return the lowest and highest
    x.domain(d3.extent(data, d => new Date(d.date))) //[earliest date, latest date]
    y.domain([0, d3.max(data, d => d.distance)]); // look at d.distance in each element in data and return the max

    //create the axis
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d=> d3.timeFormat('%b %d')(d)); //%b abbreviated month %d date

    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + " m");

    //call axes in the group
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
       .attr('transform', 'rotate(-40)')
       .attr('text-anchor', 'end');


    //7. Check if the axes are being rendered and style them in the css

    //8. create circles for data
    const circles = graph.selectAll('circle')
        .data(data)

    circles.exit().remove();
        
    circles.attr('cx', d => x(new Date(d.date)))
        .attr('cy', d=> y(d.distance))

    circles.enter()
        .append('circle')
        .attr('r',4)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d=> y(d.distance))
        .attr('fill', '#ccc')

    //11. Render line path
    // join data: requires data to be passed in as an array
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 2)
        .attr('d', line)

    //12. the lines are zig zag because the order fo data points are not defined

    //14. event listener: hover effect. make the circles bigger when hovered
    graph.selectAll('circle')
        .on('mouseover', (e,d) => {
            d3.select(e.currentTarget)
                .transition().duration(100)
                    .attr('r',8)
                    .attr('fill', '#fff')

            xDottedLine
                .attr('x1', x(new Date(d.date)))
                .attr('x2', x(new Date(d.date)))
                .attr('y1', graphHeight)
                .attr('y2', y(d.distance))

            yDottedLine
                .attr('x1', 0)
                .attr('x2', x(new Date(d.date)))
                .attr('y1', y(d.distance))
                .attr('y2', y(d.distance))

            dottedLines.style('opacity', 1);
        })
        .on('mouseleave', (e,d) => {
            d3.select(e.currentTarget)
                .transition().duration(100)
                    .attr('r',4)
                    .attr('fill', '#ccc')

            dottedLines.style('opacity', 0);
        })

}


//data and firestore

//1. set a data array which holds the updated data
var data = []

//2. set up real time listener
db.collection('activities').onSnapshot(res => {
    //get all doc changes and for each change, do something with it
    res.docChanges().forEach(change => {
        const doc = {...change.doc.data(), id:change.doc.id}

        //for alll data currently in the database, when the browser refreshes, the status will be 'added'

        switch (change.type) {
            // get the keyword from change.doc
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                // fires a bool function for each item in the data
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
})
