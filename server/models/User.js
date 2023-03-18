import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
         min: 2,
         max: 50,
      },
      lastName: {
         type: String,
         required: true,
         max: 50,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         min: 5,
      },
      location: {
         type: String,
         min: 4,
         max: 80,
      },
      occupation: String,
      password: {
         type: String,
         required: true,
      },
      picture: {
         type: mongoose.Schema.Types.ObjectId,
      },
   },
   { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;