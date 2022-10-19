const data = [
    {width:200, height:100, fill:'purple'},
    {width:100, height:60, fill:'pink'},
    {width:50, height:30, fill:'red'}
];

// no react. creates virtual rect
const rects = d3.select(".svg1").selectAll('rect')
    .data(data)
//join data attr if some rects were already in the html

// access the virtual rect using .enter can be seen in _enter field of rects in console
rects.enter()
    .append('rect') //append rect to each one of the missing rects. Only missing rects. If there was already a rect in the html file, then that data should have been loaded before enter seletion
    .attr('width', d=>d.width) 
    .attr('height', d => d.height)
    .attr('fill', d => d.fill)

const svg2 = d3.select(".svg2")
// read the json
// its async. it doesnt read but just a promise. so .then(execute when it has the data)
d3.json('planets.json').then(data => {
    // execute this after the data has been read
    const circs = svg2.selectAll('circles')
        .data(data);

        //add attr to circs already in the dom
        //why? because sometimes if you refresh there might be circles already in the dom
        circs.attr('cy',200) // hard coding
            .attr('cx', d => d.distance)
            .attr('r',d => d.radius)
            .attr('fill', d => d.fill );


        // add data to cirtual elements
        circs.enter()
            .append('circle')
            .attr('cy',200)
            .attr('cx', d => d.distance)
            .attr('r',d => d.radius)
            .attr('fill', d => d.fill );
})