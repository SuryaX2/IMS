import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category_name: {
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
        const categories = await this.find({})
            .populate("created_by", "username email role")
            .populate("updated_by", "username email");
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

categorySchema.statics.getCategoriesByUser = async function (userId) {
    try {
        const categories = await this.find({ created_by: userId })
            .populate("created_by", "username email")
            .populate("updated_by", "username email");
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

categorySchema.statics.getAdminCategories = async function () {
    try {
        const categories = await this.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            { $unwind: "$creator" },
            { $match: { "creator.role": "admin" } },
            {
                $project: {
                    category_name: 1,
                    created_by: 1,
                    updated_by: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Category = mongoose.model("Category", categorySchema);
