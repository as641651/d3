
//selects the first div in the main file
const a = document.querySelector('div')

// do somethinng similar in d3 - 'select' command
const b = d3.select('div')
// difference between a and b: b has access to d3 objects and a doesnt
// lets see them in the consol
console.log(a,b)
// go to the browser and inspecct and go to coonsol: a is simply a div, b (qn) is a selectiono object

//grab all divs
const d = document.querySelectorAll('div') // node list
const c = d3.selectAll('div')
console.log(d,c)
