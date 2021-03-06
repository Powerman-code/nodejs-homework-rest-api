const fs = require("fs/promises");
const path = require("path");
// const contacts = require("./contacts.json");
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "../model/contacts.json");
// const contactsList = fs.readFile(contactsPath, "utf8");
// console.log(contacts);

console.log(db);

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};

// const listContacts = async () => {
//   const contactsList = fs.readFile(contactsPath, "utf8");
//   return contactsList;
//   // return JSON.parse(await fs.readFile(contactsPath, "utf8"));
//   // return await db.value();
// };

const getContactById = async (contactId) => {
  return db.get("contacts").find({ contactId }).value();
};

const removeContact = async (contactId) => {
  const [record] = db.get("contacts").remove({ contactId }).write();
  return record;
};

const addContact = async (body) => {
  try {
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
    console.table(await listContacts());
  } catch (err) {
    console.log(err);
    return err;
  }
};

// const addContact = async (body) => {
//   const id = uuidv4();
//   const record = {
//     id,
//     ...body,
//   };
//   db.get("contacts").push(record).write();
//   return record;
// };

const updateContact = async (contactId, body) => {
  const record = db.get("contacts").find({ contactId }).assign(body).value();
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
