import mongoose from "mongoose";
import MessageModel from "./MessageModel.js"; // Ensure MessageModel is imported

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupProfilePicture: {
      type: String,
      default: "",
    },
    groupBio: {
      type: String,
      default: "",
    },
    groupAdmins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    unreadCounts: {
      type: Object,
      default: {},
    },
    lastMessageAt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Instead of deleting an existing model, reuse it if already registered
const ChatModel =
  mongoose.models.chats || mongoose.model("chats", chatSchema);

// Ensure that MessageModel is loaded
if (!mongoose.models.messages) {
  // Using file extension in require as well for consistency
  MessageModel
}

export default ChatModel;
