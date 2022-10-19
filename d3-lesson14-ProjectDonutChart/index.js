// anything to do with dom


const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

//runs teh call back funstion when the event (e) occurs; if form is submited
form.addEventListener('submit', (e)=>{

    // to prevent reload of page
    e.preventDefault();

    if(name.value && cost.value){
        const item = {
            name: name.value,
            cost: parseInt(cost.value)
        };

        // async
        db.collection('expenses').add(item).then(res => {
            name.value = ""
            cost.value = ""
        });

        error.textContent = ""
    }else{
        error.textContent = "Please enter values before submitting."
    }

});