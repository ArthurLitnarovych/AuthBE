import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import userModel from "../models/user.js";

const secret = process.env.SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await userModel.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ message: "User doesn`t exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "2h",
    });

    return res.status(200).json({ result: oldUser, token });
  } catch (error) {
    return res.status(500).json({ message: `An error occurred ${error}` });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "2h",
    });

    return res.status(200).json({ result, token });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }

    const result = await userModel.create({
      email,
      name,
      googleId,
    });

    return res.status(200).json({ result, token });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};
