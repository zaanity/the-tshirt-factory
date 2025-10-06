"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactsController_1 = require("../controllers/contactsController");
const router = (0, express_1.Router)();
router.post("/", contactsController_1.addContact);
router.get("/", contactsController_1.getContacts);
exports.default = router;
