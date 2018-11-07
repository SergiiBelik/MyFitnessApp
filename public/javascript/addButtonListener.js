function addButtonListener(){
    const addButtons = document.getElementsByTagName("button")
    for(let i = 0; i < addButtons.length; i++){
        addButtons[i].addEventListener('click', event => {
            // console.log(event);
            let ndbno = document.getElementById('ndbno')
            // let parentLi = event.target.parentNode
            localStorage.setItem('ndbno', ndbno.innerHTML)
            // similar behavior as an HTTP redirect
            window.location.replace('/')
            
            // similar behavior as clicking on a link
            // window.location.href = "/";
        });
    }
}