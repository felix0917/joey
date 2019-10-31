const express = require('express')
const router = express.Router()
const api = require('./api')

router.get('/login', (req, res, next) => {
  api.login(req, res, next)
})

router.post('/registe',(req,res,next)=>{
  api.registe(req,res,next)
})

module.exports = router
