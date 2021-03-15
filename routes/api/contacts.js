const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const validate = require("./validation");

router.get("/", async (_req, res, next) => {
  try {
    const allContacts = await Contacts.listContacts();
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { allContacts },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  // console.log("🚀 ~ file: contacts.js ~ line 19 ~ router.get ~ res", res);
  console.log("🚀 ~ file: contacts.js ~ line 19 ~ router.get ~ req", req);
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: { message: "Data not found" },
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", validate.createContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
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
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(201).json({
        status: "success",
        code: 201,
        data: {
          contact,
          message: "contact deleted",
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: { message: "Data not found" },
      });
    }
  } catch (e) {
    next(e);
  }
});

router.patch("/:contactId", validate.updateContact, async (req, res, next) => {
  try {
    if (req.body) {
      console.log("есть такое", req.body);
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body
      );

      return res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    }
    // if (contact) {
    //   console.log(
    //     "🚀 ~ file: contacts.js ~ line 88 ~ router.patch ~ req.body",
    //     "Есть боди"
    //   );
    //   return res.status(200).json({
    //     status: "success",
    //     code: 200,
    //     data: { contact },
    //   });
    // }
    else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: { message: "Data not found" },
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
