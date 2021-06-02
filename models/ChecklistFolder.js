const mongoose = require("mongoose");

const checklistFolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: true,
    },
    authorId: {
      type: mongoose.ObjectId,
      required: true,
    },
    checklists: [
      {
        checklist: {
          type: String,
          minlength: 10,
          required: true,
        },
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const ChecklistFolder = mongoose.model(
  "ChecklistFolder",
  checklistFolderSchema
);

module.exports = ChecklistFolder;
