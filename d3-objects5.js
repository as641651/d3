const svg = d3.select('svg')

d3.json('menu.json').then( data => {

    const min = d3.min(data, d=>d.orders) //cycle through data. for each d in data, fire a function and return the value, and return min
    const max = d3.max(data, d=>d.orders)
    const extent = d3.extent(data, d=>d.orders) //returns [min,max]

    //create a linear scale in y direction
    // pass a domain and range value
    const y = d3.scaleLinear()
        .domain([0,max]) // min and max val of input data
        .range([0,500]) // 0 to max height of graph

    // join the data to rects
    const rects = svg.selectAll('rect')
        .data(data)


    rects.attr('width',50)
        .attr('height', d=>y(d.orders))
        .attr('fill','orange')
        .attr('x', (d,i) => i*70) // not the best way of doing it. use band scale - next lecture

    rects.enter()
        .append('rect')
        .attr('width',50)
        .attr('height', d=>y(d.orders))
        .attr('fill','orange')
        .attr('x', (d,i) => i*70)
})