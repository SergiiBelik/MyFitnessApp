const onLoad = () => {
    console.log('this is onLoad function')
    window.onload = function() {
      window.opener.location.reload(true)
      }
}

onLoad()