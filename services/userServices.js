
import { connectMongoDB } from "@/config/db-config";
import { currentUser } from "@clerk/nextjs";
import UserModel from "../models/UserModel.js";
connectMongoDB();

export const GetCurrentUserFromMongoDB = async () => {
  try {
    const clerkUser = await currentUser();
    // check if the user is already in the database based on clerkUserId
    const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    if (mongoUser) {
      return JSON.parse(JSON.stringify(mongoUser));
    }

    // if the user is not in the database, create a new user in the database

    let email = "";
    if (clerkUser?.emailAddresses) {
      email = clerkUser?.emailAddresses[0]?.emailAddress || "";
    }

    const newUserPayload = {
      clerkUserId: clerkUser?.id,
      name: clerkUser?.firstName + " " + clerkUser?.lastName,
      userName: clerkUser?.username,
      email,
      profilePicture: clerkUser?.imageUrl,
    };

    const newUser = await UserModel.create(newUserPayload);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const UpdateUserProfile = async (userId, payload) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
      new: true,
    });
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const GetAllUsers = async () => {
  try {
    const users = await UserModel.find({});
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return {
      error: error.message,
    };
  }
}