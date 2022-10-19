// three rectangles. so we need three data elements

const data = [
    {width:200, height:100, fill:'purple'},
    {width:100, height:60, fill:'pink'},
    {width:50, height:30, fill:'red'}
];

// apply attributes to all rectangles. use select all
const rect = d3.select("svg").selectAll('rect')
    .data(data) // attaches data to each ondividual rect
    .attr('width', d=>d.width) //d is an individual element in data
    .attr('height', d => d.height)
    .attr('fill', d => d.fill)

console.log(rect)