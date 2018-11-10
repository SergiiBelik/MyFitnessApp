const express = require('express')
var request = require("request")
var bodyParser = require("body-parser")

const combinePromises = (context) => {
return Promise.all(
    context.map((url) => {  
    return new Promise((resolve, reject) => {    
      try{
        request({
          url: url,
        }, (err, response, body) => {
          if(err){
            reject(err);
          }else{
            context = JSON.parse(body)
            resolve(context)
          }
        })     
      }catch(error){
        reject(error);
      }    
    })
  })
)
}

module.exports = combinePromises