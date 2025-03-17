import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        connections: {
            type: Array,
            default: [],
        },
        location: {
            type: String,
            default:""
        },
        occupation: {
            type: String,
            default:""
        },
        organization: {
            type: String,
            default:""
        },
        about: {
            type: String,
            default:""
        },
        profilePicture: {
            type: String,
            default: "https://res.cloudinary.com/duaon5qkj/image/upload/v1699860664/base%28do%20not%20delete%29/profile_icon_jnd5yl.png",
        },
        pictureId: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)

export default mongoose.model("User", UserSchema);