const listCollapse = () => {
    var allLi = document.getElementsByTagName('li');
    for(var i = 0; i < allLi.length; i++){
        let listOfProducts = allLi[i].getElementsByClassName('clickable')
        for(let j = 0; j < listOfProducts.length; j++){
            listOfProducts[j].addEventListener('click', function() {
        		let childList = this.parentElement.parentElement.parentElement.children
                for(var j = 0; j< childList.length;j++){
                    if(childList[j].class != 'productLine' ){
                        var currentState = childList[j].style.display;
                        var tagName = childList[j].tagName;
                        var tagId = childList[j].id;
                        if(tagId == "addForm" || tagId == "productName"){
                            childList[j].style.display="inline"
                        }else if(currentState=="none" || currentState==""){
                            childList[j].style.display="block";
                        }else{
                            childList[j].style.display="none";
                        } 
                    }

                }
                })
        }
    }
}
listCollapse()

