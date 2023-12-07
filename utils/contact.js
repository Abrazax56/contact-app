const fs = require('fs');
const directory = './data';

if(!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}
const file = './data/contact.json';
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, '[]', 'utf-8');
}

const loadContact = () => {
  const file = fs.readFileSync('data/contact.json', 'utf-8');
  const contacts = JSON.parse(file);
  return contacts;
};

const findContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase());
  return contact;
};

//write data
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contact.json', JSON.stringify(contacts));
};
//add contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

const cekDuplicat = (name) => {
  const contacts = loadContact();
  return contacts.find(contact => contact.name === name);
};

const deleteContact = name => {
  const contacts = loadContact();
  const filterContacts = contacts.filter(contact => contact.name !== name);
  saveContacts(filterContacts);
};

const updateContact = (newContact) => {
  const contacts = loadContact();
  const filterContacts = contacts.filter(contact => contact.name !== newContact.oldName);
  delete newContact.oldName;
  filterContacts.push(newContact);
  saveContacts(filterContacts);
};

module.exports = { loadContact, findContact, addContact, cekDuplicat, deleteContact, updateContact };