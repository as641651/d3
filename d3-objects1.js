const canvas = d3.select(".canvas");
// append svg to this canvas and store the returned svg element

const svg1 = canvas.append('svg')

// now if you go to browser and inspect the elements. inside div canvas you can find svg element

//append shapes to svg container

  svg1.append('rect');
  svg1.append('circle');
  svg1.append('line');

// you still cant see anything but in the elements inside div and svg you can find the empty shape elements
// the elements dont have sizes yet. 
// to do that, we use method chaining

//set width and height to the svg element
//svg1.attr('height',600);
//svg1.attr('weight',600);


//method chaining
//const svg = canvas.append('svg').attr('height',600).attr('weight',600);

// this is the standard coding style
const svg = canvas.append('svg')
    .attr('height',600)
    .attr('width',600);

svg.append('rect')
    .attr('width',200)
    .attr('height', 100)
    .attr('fill','blue')
    .attr('x',20)
    .attr('y',20);

svg.append('circle')
    .attr('r', 50)
    .attr('cx', 300)
    .attr('cy', 70)
    .attr('fill', 'pink');
  
svg.append('line')
    .attr('x1', 370)
    .attr('x2', 400)
    .attr('y1', 20)
    .attr('y2', 120)
    .attr('stroke', 'red');

//add text element
svg.append('text')
    .attr('x',20)
    .attr('y',200)
    .attr('fill','grey')
    .text('hello world!') // .text: within the text element <text>{here}</text>
    .style('font-family','arial'); // apply css style // see the styles oon styles tab in inspect windoow // use style to make labels in graphs look good


// group shapes or elements to gether
// why? cuz a chart or graph has a bunch oof visual elements. and you can apply transformation togther


const svg2 = canvas.append('svg')
    .attr('height',600)
    .attr('width',600);

const group = svg2.append('g'); // just g - thats the element for group
//append elements to group instead of svg

group.append('rect')
    .attr('width',200)
    .attr('height', 100)
    .attr('fill','blue')
    .attr('x',20)
    .attr('y',20);

group.append('circle')
    .attr('r', 50)
    .attr('cx', 300)
    .attr('cy', 70)
    .attr('fill', 'pink');
  
group.append('line')
    .attr('x1', 370)
    .attr('x2', 400)
    .attr('y1', 20)
    .attr('y2', 120)
    .attr('stroke', 'red');

// when you insspect you ll find these elements within g tag
// now you can translate all the items at once..eg 
group.attr('transform','translate(100,10)'); // in css we use this: move 100 along x and 10 down y