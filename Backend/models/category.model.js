import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
    },
    { timestamps: true }
);

// CRUD methods
categorySchema.statics.createCategory = async function (categoryData) {
    try {
        const category = await this.create(categoryData);
        return category;
    } catch (error) {
        throw new Error(error.message);
    }
};

categorySchema.statics.getAllCategories = async function () {
    try {
        const categories = await this.find({});
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Category = mongoose.model("Category", categorySchema);
