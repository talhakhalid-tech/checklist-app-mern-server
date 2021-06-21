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

router.get("/getChecklist", async (req, res) => {
  try {
    const { folderId, checklistId } = req.query;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === checklistId
    );
    res.status(200).json({ checklist: folder.checklists[checklistIndex] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.post("/saveChecklist", async (req, res) => {
  try {
    const { folderId, checklistId, checklist } = req.body;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === checklistId
    );
    folder.checklists[checklistIndex].checklistItems = checklist;
    await folder.save();
    res.status(202).json({ message: "Checklist Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.post("/addChecklistItem", async (req, res) => {
  try {
    const { folderId, checklistId, item } = req.body;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === checklistId
    );
    folder.checklists[checklistIndex].checklistItems.push(item);
    await folder.save();
    res
      .status(202)
      .json({ folder, message: "Checklist Item Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.patch("/updateChecklistItem", async (req, res) => {
  try {
    const { folderId, checklistId, item } = req.body;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === checklistId
    );
    folder.checklists[checklistIndex].checklistItems.forEach(
      (checklistItem, index) => {
        if (checklistItem._id.toString() === item._id) {
          folder.checklists[checklistIndex].checklistItems[index] = item;
        }
      }
    );
    await folder.save();
    res
      .status(202)
      .json({ folder, message: "Checklist Item Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

router.delete("/deleteChecklistItem", async (req, res) => {
  try {
    const { folderId, checklistId, itemId } = req.query;
    const folder = await ChecklistFolder.findOne({ _id: folderId });
    const checklistIndex = folder.checklists.findIndex(
      (checklist) => checklist._id.toString() === checklistId
    );
    folder.checklists[checklistIndex].checklistItems.forEach(
      (checklistItem, index) => {
        if (checklistItem._id.toString() === itemId) {
          folder.checklists[checklistIndex].checklistItems.splice(index, 1);
        }
      }
    );
    await folder.save();
    res
      .status(202)
      .json({ folder, message: "Checklist Item Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Oops, Server Error" });
  }
});

module.exports = router;
