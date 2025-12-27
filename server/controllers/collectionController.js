const Collection = require("../Models/Collection");

// GET all collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch collections" });
  }
};

// CREATE collection (optional – for admin)
exports.createCollection = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    const exists = await Collection.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Collection already exists" });
    }

    const collection = await Collection.create({
      name,
      image,
      description,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Failed to create collection" });
  }
};
