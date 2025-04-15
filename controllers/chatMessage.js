import { GetChatMessages, SendNewMessage } from "../services/messageService.js";


export const createMessage = async (req, res) => {
  const newMessage = await SendNewMessage(req.body)

  try {
    const newMessage = await SendNewMessage(req.body)
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await GetChatMessages(req.params.chatId) 
    res.status(200).json(messages);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
