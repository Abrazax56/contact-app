const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const { loadContact, findContact, addContact, cekDuplicat, deleteContact, updateContact } = require('./utils/contact');
const app = express();
const port = 3000;

//gunakan ejs (third party midlle ware)
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 600 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.get('/', (req, res) => {
  const siswa = [
    {
      nama: "beni",
      umur: "18"
    }, {
      nama: "Via",
      umur: "19"
    }, {
      nama: "Fitriana",
      umur: "20"
    }
  ];
  res.render('index', {
    layout: 'layouts/main',
    nama: "beni",
    title: "home",
    siswa
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main',
    title: "about"
  });
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main',
    title: "contact",
    contacts,
    msg: req.flash('msg')
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add', {
    layout: 'layouts/main',
    title: "form-contact"
  });
});

app.post('/contact', [
  check('email', 'email is not valid').isEmail(),
  check('phonenumber', 'phone number is not valid').isMobilePhone('id-ID'),
  body('name').custom((value) => {
    const duplicat = cekDuplicat(value);
    if(duplicat) {
      throw new Error('name contact is already exists');
    }
    return true;
  })
  ], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('add', {
      title: "form-contact",
      layout: "layouts/main",
      errors: errors.array()
    });
  } else {
    addContact(req.body);
    req.flash('msg', 'Data successfully added');
    res.redirect('/contact');
  }
});

app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name);
  if(!contact) {
    res.status(404);
    res.send('<h1>contact is not found</h1>');
  } else {
    deleteContact(req.params.name);
    req.flash('msg', 'Data successfully deleted');
    res.redirect('/contact');
  }
});

app.get('/contact/edit/:name', (req, res) => {
  const contact = findContact(req.params.name);
  res.render('edit', {
    layout: 'layouts/main',
    title: "form-edit-contact",
    contact
  });
});

app.post('/contact/update', [
  check('email', 'email is not valid').isEmail(),
  check('phonenumber', 'phone number is not valid').isMobilePhone('id-ID'),
  body('name').custom((value, { req }) => {
    const duplicat = cekDuplicat(value);
    if(value !== req.body.oldName && duplicat) {
      throw new Error('name contact is already exists');
    }
    return true;
  })
  ], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('edit', {
      title: "form-edit-contact",
      layout: "layouts/main",
      errors: errors.array(),
      contact: req.body
    });
  } else {
    updateContact(req.body);
    req.flash('msg', 'Data successfully updated');
    res.redirect('/contact');
  }
});


app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name);
  res.render('detail', {
    layout: 'layouts/main',
    title: "contact",
    contact
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('404 not found');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});