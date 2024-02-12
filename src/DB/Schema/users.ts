import exp from "constants";
import mongoose from "mongoose";
import { couldStartTrivia } from "typescript";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },

    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false }, // added in password for extra security
        sessionToken: { type: String, select: false },
    },
});

export const UserModel = mongoose.model("User", userSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: String) =>
    UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: String) => UserModel.findById(id);
export const createUser = async (values: Record<string, any>) => {
    const newUser = await new UserModel(values).save();
    return newUser;
};
export const deleteUserById = (id: String) =>
    UserModel.findOneAndDelete({ _id: id });
