const usersRepo = require('../../repositories/users');
const express = require('express');

const { handleErrors } = require('./middlewares');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

//Signup route handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

//Signup route handler
router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    //Create a user
    const user = await usersRepo.create({ email, password });

    //Store the id of that user inside the users cookie
    req.session.userId = user.id;
    res.redirect('/admin/products');
  }
);

router.get('/signout', (req, res) => {
  //Delete cookie info
  req.session = null;
  res.send('Signed out');
});

//Sign in route
router.get('/signin', (req, res) => {
  //Pass in empty object to match the parameters of the POST route handler
  res.send(signinTemplate({}));
});

//Signin POST route handler with login validation
router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect('/admin/products');
  }
);

module.exports = router;
