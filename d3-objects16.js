// const data = [
//     { name: 'news', parent: '' },

//     { name: 'tech', parent: 'news' },
//     { name: 'sport', parent: 'news' },
//     { name: 'music', parent: 'news' },

//     { name: 'ai', parent: 'tech', amount: 7 },
//     { name: 'coding', parent: 'tech', amount: 5 },
//     { name: 'tablets', parent: 'tech', amount: 4 },
//     { name: 'laptops', parent: 'tech', amount: 6 },
//     { name: 'd3', parent: 'tech', amount: 3 },
//     { name: 'gaming', parent: 'tech', amount: 3 },

//     { name: 'football', parent: 'sport', amount: 6 },
//     { name: 'hockey', parent: 'sport', amount: 3 },
//     { name: 'baseball', parent: 'sport', amount: 5 },
//     { name: 'tennis', parent: 'sport', amount: 6 },
//     { name: 'f1', parent: 'sport', amount: 1 },

//     { name: 'house', parent: 'music', amount: 3 },
//     { name: 'rock', parent: 'music', amount: 2 },
//     { name: 'punk', parent: 'music', amount: 5 },
//     { name: 'jazz', parent: 'music', amount: 2 },
//     { name: 'pop', parent: 'music', amount: 3 },
//     { name: 'classical', parent: 'music', amount: 5 },
//   ];

  const data = [
    { name: 'news', parent: '' },

    { name: 'tech', parent: 'news', amount:19 },
    { name: 'sport', parent: 'news', amount:20 },
    { name: 'music', parent: 'news', amount:2 },

    { name: 'ai', parent: 'news', amount: 7 },
    { name: 'coding', parent: 'news', amount: 5 },
    { name: 'tablets', parent: 'news', amount: 4 },
    { name: 'laptops', parent: 'news', amount: 6 },
    { name: 'd3', parent: 'news', amount: 3 },
    { name: 'gaming', parent: 'news', amount: 3 },

    { name: 'football', parent: 'news', amount: 6 },
    { name: 'hockey', parent: 'news', amount: 3 },
    { name: 'baseball', parent: 'news', amount: 5 },
    { name: 'tennis', parent: 'news', amount: 6 },
    { name: 'f1', parent: 'news', amount: 1 },

    { name: 'house', parent: 'news', amount: 3 },
    { name: 'rock', parent: 'news', amount: 2 },
    { name: 'punk', parent: 'news', amount: 5 },
    { name: 'jazz', parent: 'news', amount: 2 },
    { name: 'pop', parent: 'news', amount: 3 },
    { name: 'classical', parent: 'news', amount: 5 },
  ];

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1060)
    .attr('height',800)

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');

const stratify = d3.stratify()
  .id(d=>d.name) // for each object what is the id
  .parentId(d=>d.parent); // for each object which is the parent

console.log(stratify(data)); 
console.log(stratify(data).data); //root node
console.log(stratify(data).children[0]); 

//gets the root node
const rootNode = stratify(data);

//create a value for each data. which property should be used to create a value.
// we need to sum up the amount. sum appends a value for each node, which will be needed by the visualizationos
rootNode.sum(d=>d.amount);
//console.log(rootNode.value);

const pack = d3.pack()
    .size([960,700])
    .padding(5)

//appends the dimensions x and y needed for the circle. the vales depends on the size given to the pack generator
console.log(pack(rootNode));

//flattens the array
console.log(pack(rootNode).descendants());

const bubbleData = pack(rootNode).descendants()

//create ordinal scales
//const colour = d3.scaleOrdinal(d3['schemeSet1']);
//colour.domain(bubbleData.map(d => d.id));

//use the depth value: 0,1,2 in data
const colour = d3.scaleOrdinal(['#d1c4e9', '#b39ddb', '#9575cd']); //different shades of purple

//join data to  group .
const nodes = graph.selectAll('g')
    .data(bubbleData)
    

//why var? we need to append circles and text separately within a group and not attach text inside circle    
const nodesEnter =  nodes.enter()
    .append('g')
    .attr('transform', d =>  `translate(${d.x}, ${d.y})` ) //for each d in data, position each group according to x and y
    
nodesEnter.append('circle')
    .attr('r', d => d.r)
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    //.attr('fill', d => colour(d.id))
    .attr('fill', d => colour(d.depth))

  //console.log(nodes)
  //set name only to noodes that dont have children
nodesEnter.filter(d=> !d.children) //d.children is False if there are no children
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em') //offset from default y position
    .attr('fill', 'white')
    .style('font-size', d => d.value*5) //larger the value, larger the font size
    .text(d => d.data.name);
