//initialize modal
const modal = document.querySelector('.modal');
M.Modal.init(modal);

//grab the elements from DOM
//form: name, parent and dept field

const form = document.querySelector('form');
const name = document.querySelector('#name');
const department = document.querySelector('#department');
const parent = document.querySelector('#parent');

form.addEventListener('submit', e => {
    e.preventDefault();

    db.collection('employees').add({

        name: name.value,
        parent: parent.value,
        department: department.value

    })
    
    //instead of this, you can use form.reset() and close the modal 
    // .then( () => {
    //     name.value = ""
    //     parent.value = ""
    //     department.value = ""
    // });
    
    var instance = M.Modal.getInstance(modal)
    instance.close();
    form.reset();
});