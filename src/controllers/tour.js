import mongoose from "mongoose";
import tourModel from "../models/tour.js";

export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new tourModel({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newTour.save();
    return res.status(200).json(newTour);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTours = async (req, res) => {
  try {
    const tours = await tourModel.find();
    return res.status(200).json(tours);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await tourModel.findById(id);
    return res.status(200).json(tour);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursByUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn`t exist" });
  }

  const tours = await tourModel.find({ creator: id });
  return res.status(200).json(tours);
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "No tour exist" });
    }

    await tourModel.findByIdAndRemove(id);
    return res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "No tour exist" });
    }

    const updatedTour = {
      creator,
      title,
      description,
      tags,
      imageFile,
      _id: id
    };
    await tourModel.findByIdAndUpdate(id, updatedTour, {new: true});
    return res.json(updatedTour);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};
