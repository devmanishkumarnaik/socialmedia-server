import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
    try {
        const { userId, desc, postImg } = req.body;
        if (desc.length > 4000) return res.status(422).json("desc can't be more than 4000 characters")
        const user = await User.findById(userId);
        let uploadedResponse = null;
        if(postImg){
            uploadedResponse = await cloudinary.uploader.upload(postImg, {
                folder: "mern-social-media"
            })
        }

        const newPost = new Post({
            userId,
            name: user.name,
            desc,
            postImg: uploadedResponse ? uploadedResponse.secure_url : "",
            postImgId: uploadedResponse ? uploadedResponse.public_id : "",
            likes: new Map(),
        })
        await newPost.save();
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in createPost", error)
        res.status(500).json(error)
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getFeedPosts", error)
        res.status(404).json(error)
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getUserPosts", error)
        res.status(404).json(error)
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params
        const { userId } = req.body
        const post = await Post.findById(postId)
        const isLiked = post.likes.get(userId)
        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { likes: post.likes },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in likePost", error)
        res.status(404).json(error)
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.body
        // await Post.findByIdAndDelete(postId)
        const post = await Post.findById(postId)
        if(post.postImgId){
            await cloudinary.uploader.destroy(post.postImgId)
        }
        await post.deleteOne()
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in deletePost", error)
        res.status(404).json(error)
    }
}

export const editPost = async (req, res) => {
    try {
        const { postId, desc, postImg } = req.body
        if (desc.length > 4000) return res.status(422).json("desc can't be more than 4000 characters")
        const post = await Post.findById(postId)
        post.desc = desc
        // post.postImg = postImg
        if(post.postImg!==postImg){
            if(post.postImgId){
                await cloudinary.uploader.destroy(post.postImgId)
            }
            let uploadedResponse = null;
            if(postImg){
                uploadedResponse = await cloudinary.uploader.upload(postImg, {
                    folder: "mern-social-media"
                })
            }
            post.postImg = uploadedResponse ? uploadedResponse.secure_url : ""
            post.postImgId = uploadedResponse ? uploadedResponse.public_id : ""
        }
        post.isEdited = true
        await post.save()
        res.status(200).json(post)
        // const updatedPost = await Post.findByIdAndUpdate(
        //     postId,
        //     { desc: post.desc, postImg: post.postImg, isEdited: true },
        //     { new: true }
        // )
        // res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in editPost", error)
        res.status(404).json(error)
    }
}

export const postComment = async (req, res) => {
    try {
        const { postId, userId, comment } = req.body
        if (comment.length > 2500) return res.status(422).json("comment can't be more than 2500 characters")
        const post = await Post.findById(postId)
        post.comments.unshift({ comment, userId })
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { comments: post.comments },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in postComment", error)
        res.status(404).json(error)
    }
}

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params
        const post = await Post.findById(postId)
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getPost", error)
        res.status(404).json(error)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.body
        const post = await Post.findById(postId)
        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId)
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { comments: post.comments },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in deleteComment", error)
        res.status(404).json(error)
    }
}

export const editComment = async (req, res) => {
    try {
        const { postId, commentId, comment } = req.body
        if (comment.length > 2500) return res.status(422).json("comment can't be more than 2500 characters")
        const post = await Post.findById(postId)
        post.comments = post.comments.map((c) => {
            if (c._id.toString() === commentId) {
                c.comment = comment
            }
            return c
        })
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { comments: post.comments },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in editComment", error)
        res.status(404).json(error)
    }
}