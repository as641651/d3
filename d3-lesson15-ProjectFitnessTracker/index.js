//grab the DOM elements we want to modify

const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

//default activiity
var activity = "cycling"

// btns are list of buttons. so we use forEach to cycle through the list: btn is access to individual button
btns.forEach(btn => {
    btn.addEventListener('click', e=>{
        //find the activity of the button
        //e.target is the reference to the current button
        //dataset is accessible because of the data-activity keyword so dataset.activity. if it was data.something, then dataset.something
        activity = e.target.dataset.activity;
        //console.log(activity)

        //remove and add active class
        btns.forEach(btn =>{
            btn.classList.remove('active')
        });
        e.target.classList.add('active')

        //set id of input field. we ll need this to access fire store
        input.setAttribute('id',activity);

        //set text of form span
        formAct.textContent = activity;

        // this function is in graph.js
        // update the data whenever a buttoon is clicked
        update(data);
    });
});

// listen when submiit button is clicked
form.addEventListener('submit', e => {
    //prevent relod of page
    e.preventDefault();
    const distance = parseInt(input.value);
    //if user has typed in something
    if(distance){
        db.collection('activities').add({
            distance:distance,
            activity:activity,
            date: new Date().toString()
        }).then( () => {
            error.textContent = ''
            input.value = ''
        });
    }else{
        error.textContent = "Please enter a valid distance"
    }

})

