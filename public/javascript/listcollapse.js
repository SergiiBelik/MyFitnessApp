const listCollapse = () => {
    var allLi = document.getElementsByTagName('li');
    for(var i = 0; i < allLi.length; i++){
        allLi[i].childNodes.forEach(childNode => {
        	if(childNode.className == 'productName'){
        		childNode.addEventListener('click', function() {
            		var childList = this.parentElement.children;
                    for(var j = 0; j< childList.length;j++){
                        if(childList[j].className != 'productName'){
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
        })
    }
}
listCollapse()
