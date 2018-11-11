const addNewProduct = () => {
    document.getElementById('add').addEventListener('click', () => {
        window.open("/search", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=800,height=400")
    })
}
addNewProduct()