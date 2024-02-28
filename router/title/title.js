const express = require(`express`);
const Title = require("../../models/title");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const titles = await Title.find({}, "name id createdAt");

    if (titles.length) {
      res.json(titles);
    } else {
      res.status(404).send("Titles not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching titles", error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const latestTitle = await Title.findOne().sort({ id: -1 });
    const newId = latestTitle ? latestTitle.id + 1 : 1;
    const newTitle = new Title({
      name: req.body.name,
      id: newId,
    });

    await newTitle.save();

    res.status(201).json({ message: "Title Created Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const titleId = req.params.id;

    // Find the title by its ID and delete it
    const deletedTitle = await Title.findOneAndDelete({ id: titleId });

    if (!deletedTitle) {
      return res.status(404).json({ message: "Title not found" });
    }

    res.status(200).json({ message: "Title deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const titleId = req.params.id;
    const newName = req.body.name;

    // Find the title by its ID and update the name
    const updatedTitle = await Title.findOneAndUpdate(
      { id: titleId },
      { name: newName },
      { new: true }
    );

    if (!updatedTitle) {
      return res.status(404).json({ message: "Title not found" });
    }

    res.status(200).json({ message: "Title updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
