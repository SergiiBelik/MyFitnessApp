const addNewProduct = () => {
    document.getElementById('add').addEventListener('click', () => {
        window.open("/search", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
    })
}
addNewProduct()