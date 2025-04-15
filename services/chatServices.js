import ChatModel from "../models/ChatModel.js";


export const CreateNewChat = async (payload) => {
  try {
    await ChatModel.create(payload);
    const newchats = await ChatModel.find({
      users: {
        $in: [payload.createdBy],
      },
    })
      .populate("users")
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(newchats));
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const GetAllChats = async (userId) => {
  try {
    const users = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      })
      .sort({ lastMessageAt: -1 });

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const GetChatDataById = async (chatId) => {
  try {
    const chat = await ChatModel.findById(chatId)
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      });
    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const UpdateChat = async ({
  chatId,
  payload,
}) => {
  try {
    await ChatModel.findByIdAndUpdate(chatId, payload);
    return {
      message: "Chat updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};
