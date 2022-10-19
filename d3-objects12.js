const svg = d3.select('.canvas')
    .append('svg')
    .attr('width',600)
    .attr('height',600)

//create a group => creates margins from svg container
const margin = {top:20, right:20, bottom:100, left:100}; // values are in pixel
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// create margins from the container
const graph = svg.append('g')
    .attr('width',graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);
    //.attr('transform','rotate(90)');


// Initial Recs should not be there for transitions to work
// graph.append('rect');
// graph.append('rect');
// graph.append('rect'); 
// graph.append('rect'); 
// graph.append('rect'); 
// graph.append('rect'); 
// graph.append('rect'); //7 rects for 5 data. 2 will be in exit selection

// group for x axis and y axis elements
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`); // should be in bottom
const yAxisGroup = graph.append('g')

//Defines Scales that doesnt depend on data
const y = d3.scaleLinear()
    .range([graphHeight,0]) // 0 to max height of graph. Scale is reversed.

const x = d3.scaleBand()
    .range([0,500])
    .paddingInner(0.2) 
    .paddingOuter(0.3); 

// create axis
const xAxis = d3.axisBottom(x); 
const yAxis = d3.axisLeft(y)
    .ticks(3) 
    .tickFormat(d=>d+ ' orders') // d does not depend on data. if it does, it should go inside update function

// doesnt depend on data
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end') //start, middle of end. Take the end of text and rotate it.
    .attr('fill', 'orange');

const t = d3.transition().duration(1000);

    //D3 Update Pattern
    // the stuffs that draws the graph
    const update = (data) => {

        //1. Update the scales (domains) if they rely on data
        y.domain([0,d3.max(data, d=>d.orders)]);
        x.domain(data.map(item => item.name));

        //2. Join the updated data to the elements
        const rects = graph.selectAll('rect')
            .data(data);
        //console.log(rects); //enter selection and exit selection. exit selection remaining rects that dont have data


        //3. Remove extra elements. If someone reduces the entries in database
        rects.exit().remove();

        //4. Update the current shapes in dom (attributes)
        // Current values of c,y,width and height are already carried from enter selection
        rects.attr('width',x.bandwidth) 
            .attr('fill','orange') 
            .attr('x', d=>x(d.name))
            .transition().duration(1000) //transition when values are changed. Then rects are already in the dom. Make sure that no rects are initially present in the dom
                .attr('height', d=> graphHeight - y(d.orders))
                .attr('y', d=>y(d.orders));

        //5. Append the enter selection.eg, if someone adds data
        rects.enter()
            .append('rect')
            .attr('width',x.bandwidth)
            .attr('height',0) //starting condition
            .attr('fill','orange')
            .attr('x', (d) => x(d.name))
            .attr('y', graphHeight) //starting condition
            //transition().duration(1000) //duration of transition
            //.merge(rects) //apply the below attributes to the rects as well // Doesnt work
            .transition(t) // use a const
                .attr('y', d=>y(d.orders)) //end condition
                .attr('height', d=> graphHeight - y(d.orders)) //end condition

        //6.call axis based on new data
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

    };

    var data = []; // dont create this every time there is a change

    //When something inside the database changes, this function is fired
    db.collection('dishes').onSnapshot(res => {

        // iterate over individual change
        res.docChanges().forEach(change => {

            // each change has a doc
            //console.log(change.doc.data());

            //... is spead operator and it unpacks the array
            const doc = {...change.doc.data(), id: change.doc.id}; // append id from firebase to the fields
            //console.log(doc);

            // We dont want to update the whole database for individual data changes.
            //in the response, we can find out the type of change and perform the required action based on the case
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

    //Initial position
    //y = graphHeight
    // height = 0


