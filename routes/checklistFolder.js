const express = require("express");
const ChecklistFolder = require("../models/ChecklistFolder");

const router = express.Router();

router.get("/defaultFolder", async (req, res) => {
  try {
    const defaultFolder = await ChecklistFolder.findOne({
      authorId: req.query.userId,
      name: "Default Folder",
    });
    res.status(200).json({ defaultFolder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const folders = await ChecklistFolder.find({ authorId: req.query.userId });
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, userId: authorId } = req.body;

    const alreadyExists = await ChecklistFolder.findOne({ name, authorId });

    if (alreadyExists) {
      res.status(409).json({ error: "Folder Already Exists" });
    }

    const folder = new ChecklistFolder({
      name,
      authorId,
    });

    await folder.save();

    res.status(201).json({ folder, message: "Folder Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.post("/createChecklist", async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    folder.checklists.push({ checklistName: name });
    await folder.save();
    res.status(201).json({ folder, message: "Checklist Created Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.delete("/deleteChecklist", async (req, res) => {
  try {
    const folder = await ChecklistFolder.findOne({ _id: req.query.folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === req.query.checklistId
    );
    folder.checklists.splice(checklistIndex, 1);
    await folder.save();
    res.status(202).json({ folder, message: "Checklist Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

module.exports = router;
