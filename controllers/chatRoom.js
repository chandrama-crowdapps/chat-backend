import { CreateNewChat, GetAllChats, GetChatDataById } from "../services/chatServices.js";

export const createChatRoom = async (req, res) => {

  try {
    const payload = req.body;
    const newChatRoom = await CreateNewChat(payload);
    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getChatRoomOfUser = async (req, res) => {
  try {
    const chatRoom = await GetAllChats(req.params.userId);
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getChatRoomOfUsers = async (req, res) => {
  try {
    const chatRoom = await GetChatDataById(req.params.chatId);
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
