import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: String,
        desc: String,
        postImg: String,
        postImgId: String,
        likes: {
            type: Map,
            of: Boolean
        },
        comments: [
            {
                comment: String,
                userId: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        isEdited: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export default mongoose.model("Post", postSchema);