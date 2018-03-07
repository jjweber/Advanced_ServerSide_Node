var express = require('express');
var router = express.Router();

GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
let util = require('util');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const v = require('node-input-validator');
var nodeWidget = require('node-widgets');


passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(ob, done) {
  done(null, { id: ob.id, email:ob.email, name:ob.name, picture:ob.picture});
});

passport.use(new GoogleStrategy({
  clientID: '446678059336-4qg3da3rgu12dnci0e7b545rdt9b4t6j.apps.googleusercontent.com',
  clientSecret: '6a-wY8J2wZcyLoeqWhe08evw',
  callbackURL: 'https://localhost:3000/auth/google/callback',
},
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
    console.log(profile);
    return done(null, { id: profile.id, email:profile.emails[0].value});
  });
}
));

const authed = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};


// For use without sequelize.
// U = require('../models/user.js');

// Requiring sequelize.
var Sequelize = require('sequelize');

// Creating an instance of sequelize for the users table.
const sequelize = new Sequelize('users', 'root', 'root', 
  { host: 'localhost', dialect: 'mysql', port: 6000 }
);

// Testing the mysql database connection.
sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Creating and defining a User model.
const U = sequelize.define('user', {
  firstName: {
        type: Sequelize.STRING
    },

    lastName: {
        type: Sequelize.STRING
    },

    email: {
      type: Sequelize.STRING
    },

    age: {
      type: Sequelize.INTEGER
    }
});


// force: true will drop the table if it already exists
/*
U.sync({force: true}).then(() => {
  // Table created
  return U.create({
    firstName: 'Justin',
    lastName: 'Weber',
    email: 'jjweber@student.fullsail.edu',
    age: '38'
  });
});
*/

router.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/api/user', authed, function(req, res) {
  res.json(req.user);
});

router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login', "email"] })
);

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/'
  })
);

router.get('/welcome', authed, function(req, res) {
  console.log(req.user);
  //console.log(passport.session);
  //console.log('session.Session');
  res.render('welcome', {
    title: 'welcome',
    user: req.user,
    navitems: [
      {link: '/', content: 'Home'},
      {link: '/users', content: 'Users'},
      {link: '/form', content: 'Form'},
      {link: '/auth/google', content: 'Login'},          
      {link: '/welcome', content: 'Welcome'}    
    ]
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
            title: 'Home',
            navitems: [
            {link: '/', content: 'Home'},
            {link: '/users', content: 'Users'},
            {link: '/form', content: 'Form'},
            {link: '/auth/google', content: 'Login'},          
            {link: '/welcome', content: 'Welcome'} 
        ] });
});

/* GET users page. */
router.get('/staticUsers', function(req, res, next) {
  getUsers = function() {
    var users = [{"name":"sdf", "lastname":"Asdf"}];
    return users;
  }
  res.render('users', { 
            title: 'Users',
            users: [{"Name":"Justin", "LastName":"Weber", "id":"1"}, {"Name":"John", "LastName":"Doe" , "id":"2"}],
            navitems: [
            {link: '/', content: 'Home'},
            {link: '/users', content: 'Users'},
            {link: '/form', content: 'Form'},
            {link: '/auth/google', content: 'Login'},          
            {link: '/welcome', content: 'Welcome'} 
        ] });
});

/* GET users page. */
router.get('/users', function(req, res, next) {

  users = U.findAll().then(users => {

    res.render('users', { 
        title: 'Users',
        users: users,
        navitems: [
        {link: '/', content: 'Home'},
        {link: '/users', content: 'Users'},
        {link: '/form', content: 'Form'},
        {link: '/auth/google', content: 'Login'},          
        {link: '/welcome', content: 'Welcome'} 
    ] });
    
  }) 

  // For use without sequelize
  /* var userObj = new U({}, req);

  userObj.getAll(function(users) {

    res.render('users', { 
        title: 'Users',
        users: users,
        navitems: [
        {link: '/', content: 'Home'},
        {link: '/users', content: 'Users'},
        {link: '/form', content: 'Form'}
    ] });

  })
  */

});

/* GET Add Users form. */
router.get('/add_user_Form', function(req, res, next) {
  
  var incomingJson = {
    "form": "myAddForm",
    "action": "/validate_User_Add_Form",
    "method": "post",
    "fields": {
      "firstName": {
        "label" : "First Name",
        "type": "text",
        "class": "form-control",
        "required": true,
        "minlen" : 1,
        "maxlen" : 20,
        "msg": "First Name is Required"
      },
      "lastName": {
        "label" : "Last Name",
        "type": "text",
        "class": "form-control",
        "required": true,
        "minlen" : 1,
        "maxlen" : 20,
        "msg": "Last Name is Required"
      },
      "email" : {
        "label" : "Email Address",
        "class": "form-control",
        "type" : "email",
        "required": true,
        "msg": "Email Address is Invalid",
      },
      "age": {
        "label": "Age",
        "type": "number",
        "class": "form-control",
        "required": true,
        "msg": "Age is Invalid",
        "minval": 1,
        "maxval": 200
      },
      "button": {
        "type": "submit",
        "class": "btn btn-primary",
        "value" : "Add User"
      }
    }
  }

  // Create the HTML form using json object
  nodeWidget.toHTML(incomingJson, function(err, form){
    if(err) { throw err; }
    
    // form - is the template rendered HTML elements
    res.send(form);
    return next();
  });
});

/* POST Validate users route.*/ 
router.post('/validate_User_Add_Form', function(req, res, next) {
  var incomingData = req.body;
  
    nodeWidget.validate(incomingData, function(err, valid, form){
      //console.log("your form is valid ? " + valid);
      
      if(err) { throw err }
      console.log("your form is valid ? " + valid + JSON.stringify(incomingData));
      if (valid == false) {
        res.send(form);
      } else {
        U.create({
          firstName: incomingData.firstName,
          lastName: incomingData.lastName,
          email: incomingData.email,
          age: incomingData.age
        });
        res.redirect('/users');
      }
      
      return next();
      
    });
    
});

/* POST Delete U.*/ 
router.post('/delete_user_Form', function(req, res, next) {
  var incomingData = req.body.idField;

  console.log(incomingData);
  
  U.destroy({
    where: {
      id: incomingData
    }
  }).then(function() {
    res.redirect('/users');
  })

});

/* POST Edit U form.*/ 
router.post('/edit_user_Form', function(req, res, next) {
  var formData = req.body.userEdit;

  var current = U.findAll(
    {
      where: {
        id: formData,
      }
    }).then(function(foundUser){
      
      var incomingJson = {
        "form": "myEditForm",
        "action": "/validate_User_Edit_Form",
        "method": "post",
        "fields": {
          "id": {
            "type": "hidden",
            "value": formData
          },
          "firstName": {
            "label" : "First Name",
            "type": "text",
            "class": "form-control",
            "value": foundUser[0].firstName,                    
            "required": true,
            "minlen" : 1,
            "maxlen" : 20,
            "msg": "First Name is required"
          },
          "lastName": {
            "label" : "Last Name",
            "type": "text",
            "class": "form-control",
            "value": foundUser[0].lastName,        
            "required": true,
            "minlen" : 1,
            "maxlen" : 20,
            "msg": "Last Name is required"
          },
          "email" : {
            "label" : "Email Address",
            "class": "form-control",
            "type" : "email",
            "value": foundUser[0].email,                    
            "required": true,
            "msg": "Email Address is invalid",
          },
          "age": {
            "label": "Age",
            "type": "number",
            "class": "form-control",
            "value": foundUser[0].age,                    
            "required": true,
            "msg": "Age is Invalid",
            "minval": 1,
            "maxval": 200
          },
          "button": {
            "type": "submit",
            "class": "btn btn-primary",
            "value" : "Save Changes"
          }
        }
      }
    
      // Create the HTML form using json object
      nodeWidget.toHTML(incomingJson, function(err, form){
        if(err) { throw err; }
        
        // form - is the template rendered HTML elements
        res.send(form);
        return next();
      });

    });
    
});

/* POST Validate users route.*/ 
router.post('/validate_User_Edit_Form', function(req, res, next) {
  var incomingData = req.body;
  
    nodeWidget.validate(incomingData, function(err, valid, form){
      console.log("your form is valid ? " + incomingData);
      
      if(err) { throw err }
      console.log("your form is valid ? " + valid + incomingData);
      if (valid == false) {
        res.send(form);
      } else {
        U.update({
            firstName: incomingData.firstName,
            lastName: incomingData.lastName,
            email: incomingData.email,
            age: incomingData.age            
          },
        {
          where: {
            id: incomingData.id
          }, 
          returning: true
        });
        
        res.redirect('/users');
      }
      
      return next();
      
    });
    
});

/* GET form page.*/ 
router.get('/form', function(req, res, next) {
  res.render('form', { 
            title: 'Form',
            nameInValid: req.flash('nameCheck'),
            emailInValid: req.flash('emailCheck'),
            test: [
              {message: req.flash('info')},
              {message: req.flash('info')}
            ],
            navitems: [
            {link: '/', content: 'Home'},
            {link: '/users', content: 'Users'},
            {link: '/form', content: 'Form', title: 'Form Validation', success: false, errors: req.session.errors},
            {link: '/auth/google', content: 'Login'},          
            {link: '/welcome', content: 'Welcome'}            
            ]
      });
      
});

/* GET form page.*/ 
router.get('/successForm', function(req, res, next) {
  res.render('successForm', { 
            title: 'successForm',
            nameInValid: req.flash('nameCheck'),
            emailInValid: req.flash('emailCheck'),
            test: [
              {message: req.flash('info')},
              {message: req.flash('info')}
            ],
            navitems: [
            {link: '/', content: 'Home'},
            {link: '/users', content: 'Users'},
            {link: '/form', content: 'Form', title: 'Form Validation', success: false, errors: req.session.errors},
            {link: '/auth/google', content: 'Login'},          
            {link: '/welcome', content: 'Welcome'}            
            ]
      });
      //res.send('show', { message: req.flash('info') });  
      
});

// Handling POST from registerForm.
router.post('/submit', function(req, res, next) {

  const name = req.body.name;
  const email = req.body.email;
  const myFile = req.body.myFile;

  let r = {};   // first argument for constructor will always be blank object 
  let validator = new v(r, {name: req.body.name, email: req.body.email}, {name:'required', email:'required|email'});

  
  // Performing validation
  validator.check().then(function (matched) {

    //const name_error = JSON.stringify(validator.errors['name']['message']);
    //const email_error = JSON.stringify(validator.errors['email']['message']);
    
    if(JSON.stringify(matched) == 'false') {

      if((JSON.stringify(validator.errors['name'])) && (JSON.stringify((matched)) == 'false')){
        console.log('Invalid!!');       
        req.flash('nameCheck', JSON.stringify(validator.errors['name']['message'])); 
        req.flash('emailCheck', '');                   
        //res.redirect('/form');      
            
      } else if((JSON.stringify(validator.errors['email'])) && (JSON.stringify((matched)) == 'false')){
        console.log('Invalid!!');       
        req.flash('nameCheck', '');         
        req.flash('emailCheck', JSON.stringify(validator.errors['email']['message']));           
        //res.redirect('/form');      
      } else {
        req.flash('nameCheck', JSON.stringify(validator.errors['name']['message']));         
        req.flash('emailCheck', JSON.stringify(validator.errors['email']['message']));           
        //res.redirect('/form');      
        
      }
      
      res.redirect('/form');      
      
    } 
    if(JSON.stringify(matched) == 'true') {
      res.redirect('/successForm');
    }
    
  });

});

module.exports = router;

