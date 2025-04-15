import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    uid: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
      },
      profilePicture: {
        type: String,
        required: false,
      },
      isProfilePictureSet: {
        type: Boolean,
        default: false,
      },
      bio: {
        type: String,
        required: false,
      },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;