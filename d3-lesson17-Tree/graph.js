//3.svg

const dims = {height:500, width:1100} //of tree diiag. svg is bigger

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width+100) //50px on left and right
    .attr('height', dims.height+100) //50px on top and bottom

//4. graph group
const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');


//5. data startify
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId( d=> d.parent);

//7.tree generator
const tree = d3.tree()
    .size([dims.width, dims.height]);

const colour = d3.scaleOrdinal(d3['schemeSet2']);
//const colour = d3.scaleOrdinal(['#f4511e', '#e91e63', '#e53935', '#9c27b0']); //manual color: should match the num departments
//colour.domain(bubbleData.map(d => d.id));

var data = [];

const update = (data) => {
    //console.log(data);

    //16. remove current nodes. otherwise you have to treat enter exit and current dom elements separately (diirty trick)
    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();

    colour.domain(data.map(d => d.department));

    //6.get updated root node
    const rootNode = stratify(data);

    //9. pass data through tree
    const treeData = tree(rootNode); // now there are x and y positions. does similar things to pack function
    console.log(treeData);

    //14. Get link selection and join data. Create Links before rectange so that links go back of rects
    const links = graph.selectAll('.link')
        .data(treeData.links()) //link() provides the kind of data we need to create links
    //console.log(treeData.links()); //we now have the co-ords of source and target
    //lists all links

    //15. enter new links
    links.enter()
        .append('path')
        .transition().duration(300)
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width',1)
        .attr('d', d => d3.linkVertical().x(d => d.x).y(d => d.y)(d));

    //10. create a group with class node. note it needednt be g
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants()); //lists all nodes

    //11. Create enter node groups. We wan to add several things to this, thats why separate variable
    const enterNodes = nodes.enter()
        .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

    //12. add rects and
    enterNodes.append('rect')
        .attr('fill', d => colour(d.data.department))
        .attr('stroke', '#555')
        .attr('stroke-width', 1)
        .attr('rx',5) //rounded edges
        .attr('height', 50)
        .attr('width', d =>d.data.name.length*20)
        .attr('transform', d=> `translate(-${d.data.name.length*20/2},-25)`) //we found this required adjustment after rendering

    //13 add text
    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.name)

}

//2. set up real time listener
db.collection('employees').onSnapshot(res => {
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