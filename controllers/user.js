import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password')
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getUser", error)
        res.status(404).json({ message: error.message });
    }
}

export const getUserConnections = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        const connections = await User.find({ _id: { $in: user.connections } }, { password: 0 })
        res.status(200).json(connections);
    } catch (error) {
        console.log("error in getUserConnections", error)
        res.status(404).json({ message: error.message });
    }
}

export const addRemoveConnection = async (req, res) => {
    try {
        const { id, connectionId } = req.params;

        const user = await User.findById(id)
        const connection = await User.findById(connectionId)

        if (user.connections.includes(connectionId)) {
            user.connections = user.connections.filter(id => id !== connectionId)
            connection.connections = connection.connections.filter(id => id !== id)
        } else {
            user.connections.push(connectionId)
            connection.connections.push(id)
        }

        await user.save()
        await connection.save()

        const connections = await User.find({ _id: { $in: user.connections } }, { password: 0 })
        res.status(200).json(connections);
    } catch (error) {
        console.log("error in addRemoveConnection", error)
        res.status(404).json({ message: error.message });
    }
}

export const editUser = async (req, res) => {
    try{
        const {userId,name,about,location,occupation,organization,profilePicture} = req.body
        const user =await User.findById(userId)
        if(user.profilePicture!==profilePicture){
            if(user.pictureId!==""){
                console.log("destroying from cloudinary and setting pictureId to empty")
                await cloudinary.uploader.destroy(user.pictureId)
                user.pictureId=""
            }
            let uploadedResponse = await cloudinary.uploader.upload(profilePicture, {
                folder: "mern-social-media",
            })
            if(uploadedResponse){
                user.profilePicture = uploadedResponse.secure_url,
                user.pictureId = uploadedResponse.public_id
            }
        }
        user.name = name
        user.about = about
        user.location = location
        user.occupation = occupation
        user.organization = organization
        await user.save()
        console.log("new user=",user)
        res.status(200).json(user)

    } catch (error){
        console.log("error in editUser", error)
        res.status(404).json({ message: error.message });
    }
}