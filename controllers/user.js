import User from "../models/UserModel.js";

export const getAllUsers = async (req, res) => {
  const maxResults = 10;
  let users = [];

  try {
    const userRecords = await User.find();

    userRecords.users.forEach((user) => {
      const { uid, email, name, profilePicture } = user;
      users.push({ uid, email, name, profilePicture });
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await User.findOne({uid: req.params.userId});

    const { uid, email, name, profilePicture } = userRecord;

    res.status(200).json({ uid, email, name, profilePicture });
  } catch (error) {
    console.log(error);
  }
};
