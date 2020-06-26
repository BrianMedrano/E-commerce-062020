const usersRepo = require('../../repositories/users');
const express = require('express');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

//Signup route handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email already in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords do not match!');
  }

  //Create a user
  const user = await usersRepo.create({ email, password });

  //Store the id of that user inside the users cookie
  req.session.userId = user.id;
  res.send('Account created!');
});

router.get('/signout', (req, res) => {
  //Delete cookie info
  req.session = null;
  res.send('Signed out');
});

//Sign in route
router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  //Validate password
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.userId = user.id;
  res.send('You are signed in!');
});

module.exports = router;
