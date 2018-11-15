const addNewProduct = () => {
    let add = document.querySelectorAll('div button')
    
    for(let i = 0; i < add.length; i++) {
        add[i].addEventListener('click', (e) => {
            console.log(add[i])
            if(add[i].id == 'breakfast'){
                window.open("/breakfast", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=800,height=400")
            } else if(add[i].id == 'lunch'){
                window.open("/lunch", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=800,height=400")
            } else if(add[i].id == 'dinner'){
                window.open("/dinner", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=800,height=400")
            }
    })
    }
}
addNewProduct()

