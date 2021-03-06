const express = require("express");
const router = express.Router();
const Contacts = require("../../model/contacts.json");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await Contacts.listContacts();
    res.status(200).json({
      status: "success",
      code: 200,
      data: { allContacts },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.patch("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
