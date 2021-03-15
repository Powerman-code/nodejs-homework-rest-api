const fs = require("fs/promises");
const path = require("path");
// const contacts = require("./contacts.json");
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./contacts.json");

const normalizeId = (id) => Number(id) || id;
// const contactsList = fs.readFile(contactsPath, "utf8");
// console.log(contacts);

console.log(db);

// const listContacts = async () => {
//     const data = await fs.readFile(contactsPath, "utf8");
//     return JSON.parse(data);
// };

const listContacts = async () => {
  return await db.value();
};

const getContactById = async (contactId) => {
  const normalizedId = normalizeId(contactId);
  const allContacts = await listContacts();
  const contactToFind = await allContacts.find(({ id }) => id === normalizedId);
  return contactToFind;
};

// lowdb method getContactById =>

// const getContactById = async (contactId) => {
//   const normalizedId = normalizeId(contactId);
//   const contactToFind = await db.find({ id: normalizedId }).value();
//   return contactToFind;
// };

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const visibleContacts = await allContacts.filter(
    ({ id }) => id !== contactId
  );

  const contactToRemove = allContacts.find(({ id }) => id === contactId);

  await fs.writeFile(
    contactsPath,
    JSON.stringify(visibleContacts, null, 2),
    "utf-8"
  );

  return contactToRemove;
};

// const removeContact = async (contactId) => {
//   const normalizedId = normalizeId(contactId);
//   const record = db.remove({ id: normalizedId }).write();
//   return record;
// };

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    ...body,
  };

  const updatedContactList = [...allContacts, newContact];

  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContactList, null, 2),
    "utf-8"
  );
  return newContact;
};

// Используя addContact lowdb =>

// const addContact = async (body) => {
//     const id = uuidv4();
//     const record = {
//       id,
//       ...body,
//     };
//     console.log(typeof db.value());
//     db.push(record).write();
//     return record;
// };

const updateContact = async (contactId, body) => {
  const normalizedId = normalizeId(contactId);

  const allContacts = await listContacts();

  const contactToUpdate = await allContacts.find(
    ({ id }) => id === normalizedId
  );

  const updatedContact = { ...contactToUpdate, ...body };

  const updatedContactList = await allContacts.map((item) =>
    item.id === contactToUpdate.id ? updatedContact : item
  );

  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContactList, null, 2),
    "utf-8"
  );
  return updatedContact;
};

// const updateContact = async (contactId, body) => {
//   const record = db.find({ id: contactId }).assign(body).value();
//   db.write();
//   return record.id ? record : null;
// };

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
