const express = require("express");
const router = express.Router();
const {
  getCollections,
  createCollection,
} = require("../controllers/collectionController");

// GET /collection
router.get("/", getCollections);

// POST /collection (optional)
router.post("/", createCollection);

module.exports = router;
