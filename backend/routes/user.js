const express = require('express');
const router = express.Router();
const rateLimit = require ( " express-rate-limit " ) ; // Limitation des tentatives de connection

const userCtrl = require('../controllers/user');
const createAccountLimiter = rateLimit(
    {
      windowMs : 60 * 60 * 1000 , //  fenêtre de 1 heure     
      max :'5', // 5 tentatives
      message : " Trop de tentatives à partir de cette adresse IP, veuillez réessayer après une heure "
    }
  )	

router.post('/signup', userCtrl.signup);
router.post('/login',  userCtrl.login, createAccountLimiter);



module.exports = router;