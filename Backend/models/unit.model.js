import mongoose from "mongoose";

const unitSchema = mongoose.Schema(
    {
        unit_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// CRUD methods
unitSchema.statics.createUnit = async function (unitData) {
    try {
        const unit = await this.create(unitData);
        return unit;
    } catch (error) {
        throw new Error(error.message);
    }
};

unitSchema.statics.getAllUnits = async function () {
    try {
        const units = await this.find({});
        return units;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Units created by a specific user
unitSchema.statics.getUnitsByUser = async function (userId) {
    try {
        const units = await this.find({ created_by: userId });
        return units;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Unit = mongoose.model("Unit", unitSchema);
