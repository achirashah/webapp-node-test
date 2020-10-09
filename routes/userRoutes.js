const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkToken } = require("../auth/token_validator");
//unprocted routes 
router
  .route('/')
  .get(userController.getAllusers)
  .post(userController.checkBody,userController.checkUserForEmail,userController.createUser);
  router
  .route('/self')
  .get(checkToken,userController.getUser)
  .put(checkToken,userController.checkBody,userController.checkUser,userController.updateUser)

  // get user by id 
router
   .route('/:id')
  .get(userController.getUserById)
// update and get an user


module.exports = router;