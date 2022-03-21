import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const plantSchema = new Schema({

    plant_user_id: { type: String, required: [true] },
    plant_id: { type: String, required: [true], unique: true },
    plant_name: {  type: String, required: [true]},
    plant_process: {  type: String, required: [true]},
    plant_subprocess: {  type: String, required: [true]},
    plant_city: {  type: String, required: [true]},
    plant_equipment_name: { type: String, required: [true]},
    plant_equipment_id: { type: String, required: [true]},
    plant_selected: { type: Boolean, required: [true], default: false },
    plant_date: { type: Number}
});


//Validator
plantSchema.plugin(uniqueValidator, { message: 'Error, Planta ya Existe.'});


// convert to model
const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
