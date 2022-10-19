const svg = d3.select("svg")

// band scale splits up the data into equal width depending ono much data is there in the domain

d3.json('menu.json').then(data => {

    const y = d3.scaleLinear()
       .domain([0,1000]) // min and max val of input data
       .range([0,500]) // 0 to max height of graph

    // tells where the bars start
       const x = d3.scaleBand()
        .domain(data.map(item => item.name)) // map function is cycling through data array and for each item, you do something and return new array. Map: new array based on current array
        .range([0,500])
        .paddingInner(0.2) // space between the bars (between 0 and 1)
        .paddingOuter(0.3); // space from edges of the graph area

    console.log(x("veg curry")) // starting pixel
    console.log(x.bandwidth()) // width of each bar

    // join the data to rects
    const rects = svg.selectAll('rect')
        .data(data)


    rects.attr('width',x.bandwidth) //bandwidth() wiill invoke the function. But we are just passing the function
        .attr('height', d=>y(d.orders))
        .attr('fill','orange')
        .attr('x', d=>x(d.name)) // not the best way of doing it. use band scale - next lecture

    rects.enter()
        .append('rect')
        .attr('width',x.bandwidth)
        .attr('height', d=>y(d.orders))
        .attr('fill','orange')
        .attr('x', (d) => x(d.name))

})