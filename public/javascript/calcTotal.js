const calcTotal = () => {
    let pr = document.getElementsByClassName('protein')
    let sumProtein = 0
    for(let i = 0; i < pr.length; i++){
	    sumProtein += Number(pr[i].innerHTML)
    }
    
    let carbs = document.getElementsByClassName('carbs')
    let sumCarbs = 0
    for(let i = 0; i < carbs.length; i++){
	    sumCarbs += Number(carbs[i].innerHTML)
    }
    
    let fat = document.getElementsByClassName('fat')
    let sumFat = 0
    for(let i = 0; i < fat.length; i++){
	    sumFat += Number(fat[i].innerHTML)
    }
    
    let energy = document.getElementsByClassName('energy')
    let sumEnergy = 0
    for(let i = 0; i < energy.length; i++){
	    sumEnergy += Number(energy[i].innerHTML)
    }
    
    let proteinTotal = document.getElementById('proteinTotal')
    let carbsTotal = document.getElementById('carbsTotal')
    let fatTotal = document.getElementById('fatTotal')
    let energyTotal = document.getElementById('energyTotal')
    
    
    
    proteinTotal.innerHTML = sumProtein
    carbsTotal.innerHTML = sumCarbs
    fatTotal.innerHTML = sumFat
    energyTotal.innerHTML = sumEnergy
    
}

calcTotal()