// use data method to attach data to shapes

// d3 expects data in array format
const data = [
    {width:400, height:100, fill:'purple'}
];

// get the rectangle inside svg and apply attributes
const svg = d3.select('svg');

//data method and function(d)
svg.select('rect')
    .data(data) //input data is passed as param to functiioon
    .attr('width',function(d){
        console.log(d) // d is the data passed in through .data
        return d.width
    }) 
    .attr('height',function(d){return d.height})
    .attr('fill',function(d){return d.fill});

//other parameters of function
const svg2 = d3.select('.canvas').append('svg').attr('height',600).attr('width',600);
svg2.append('rect')
    .data(data)
    .attr('width', function(d,i,n){
        console.log(i); //0; i is the index of the rectangle
        console.log(n); // list of rectangles. we ll see more about this later
        return d.width})

//Arrow function
// the keyword function is too long. therefore we change
// function(d){return d.width} to (d) => {return d.width}
// however there is a difference

d3.select('.canvas').append('svg').attr('height',600).attr('width',600).append('rect');

//now we select.. this is still the first rectangle
svg.select('rect')
    .data(data)
    .attr('width',(d,i,n)=>{
        console.log(n[i]) //n[i] is the currect element
        return d.width
    })
    .attr('height', function(d){
        console.log(this) //this is the current element
        return d.height
    })
    .attr('fill',(d) => d.fill); // this is also a valid syntax if the function is just returning a value. braces are needed only if there is extra code
    // you can also take off the parenthesis if you pass just oone arg. so this is also valid: "d => d.fill". need params only for more than one arg