const onLoad = () => {
    console.log('this is onClose function')
    window.onload = function() {
      window.opener.location.reload(true)
      }
}

onLoad()