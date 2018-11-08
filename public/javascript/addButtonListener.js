const addButtonListener = () => {
    const addButtons = document.getElementsByTagName("button")
    for(let i = 0; i < addButtons.length; i++){
        addButtons[i].addEventListener('click', event => {
            // console.log(event);
            let lis = document.getElementById('products-container').getElementsByTagName('li')

            for(let i = 0; i < lis.length; i++){
            lis[i].className = 'hidden'
            }
           
        });
    }
}
addButtonListener()
