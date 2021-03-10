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
//   try {
//     const data = await fs.readFile(contactsPath, "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     throw error;
//   }
// };

const listContacts = async () => {
  return await db.value();
};

// const getContactById = async (contactId) => {
//   try {
//     const allContacts = await listContacts();
//     const contactToFind = await allContacts.find(({ id }) => id === contactId);
//     return contactToFind;
//   } catch (e) {
//     throw e;
//   }
// };

// lowdb method getContactById =>

const getContactById = async (contactId) => {
  const normalizedId = normalizeId(contactId);
  const contactToFind = await db.find({ id: normalizedId }).value();
  return contactToFind;
};

const removeContact = async (contactId) => {
  const [record] = db.value().remove({ contactId }).write();
  return record;
};

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
//   try {
//     const id = uuidv4();
//     const record = {
//       id,
//       ...body,
//     };
//     console.log(typeof db.value());
//     db.push(record).write();
//     return record;
//   } catch (error) {
//     console.log(err);
//     return err;
//   }
// };

const updateContact = async (contactId, body) => {
  // const record = db.get("contacts").find({ contactId }).assign(body).value();
  // db.write();
  // return record.id ? record : null;
  const record = db.value().find({ contactId }).assign(body).value();
  db.write();
  return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
