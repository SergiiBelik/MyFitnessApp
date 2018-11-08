const listCollapse = () => {
var allLi = document.getElementsByTagName('li');
for(var i = 0; i < allLi.length; i++){
    allLi[i].addEventListener("click", function() {
        // var childList = this.children.getElementsByTagName('div');
        var childList = this.children;
        for(var j = 0; j< childList.length;j++){
            var currentState = childList[j].style.display;
            var tagName = childList[j].tagName;
            var tagId = childList[j].id;
            if(tagName == "BUTTON" || tagId == "productName"){
                childList[j].style.display="inline"
            }
            else if(tagId == "firstRow"){
                childList[j].style.display="block-inline"
            }
            else if(currentState=="none" || currentState==""){
                childList[j].style.display="block";
            }else{
                childList[j].style.display="none";
            }   
        }
    }
  );
}
}
listCollapse()
