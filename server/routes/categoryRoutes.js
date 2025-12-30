const express = require("express");
const router = express.Router();
const { addCategory, getCategories } = require("../controllers/categoryController");

router.get("/", getCategories);       // fetch all categories
router.post("/", addCategory);        // add new category

module.exports = router;
