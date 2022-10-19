
// getting data from firebase.
// it doesnt return the exact data
db.collection('dishes').get().then(res => {
    //console.log(res);
    var data = [];
    res.docs.forEach(doc => {
        //console.log(doc.data());
        data.push(doc.data());
    });
    console.log(data)
})