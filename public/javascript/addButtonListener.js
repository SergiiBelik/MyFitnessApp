var mongoose = import(mongoose)
mongoose.connect('mongodb://localhost/my_fitness_app')
const Product = require('../../models/product.js')

// Product.create({
//     name: 'test bread'
// }, (err, product) => {
//     if(err){
//         console.log(err)
//     } else {
//         console.log(product)
//     }
// })


const addButtonListener = () => {
    const addButtons = document.getElementsByTagName("button")
    for(let i = 0; i < addButtons.length; i++){
        addButtons[i].addEventListener('click', event => {
            // console.log(event);
            // let lis = document.getElementById('products-container').getElementsByTagName('li')

            // for(let i = 0; i < lis.length; i++){
            // lis[i].className = 'hidden'
            // }
           var newProduct = new Product({
               name: 'test bread2'
           })
           newProduct.save((err, product) => {
               if(err){
                   console.log(err)
               } else {
                   console.log(product)
               }
           })
        });
    }
}
addButtonListener()
