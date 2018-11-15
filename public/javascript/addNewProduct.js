const addNewProduct = () => {
    let add = document.querySelectorAll('div button')
    
    for(let i = 0; i < add.length; i++) {
        add[i].addEventListener('click', (e) => {
            // console.log(e.srcElement.parentNode.id)
            window.open("/search", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=800,height=400")
    })
    }
}
addNewProduct()

