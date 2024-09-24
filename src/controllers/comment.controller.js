import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.models.js"
import { Video } from "../models/video.models.js"
import  apiError  from "../utils/apiError.js"
import  apiResponse  from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new apiError(401, "Not a valid object id");
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1
                },
                isLiked: 1
            }
        }
    ]);
    console.log(commentsAggregate);
    
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(commentsAggregate, options);
    console.log(comments);
    
    return res
        .status(200)
        .json(new apiResponse(200, comments, "Comments fetched successfully"));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    // get the videoId jispe comment krna hai
    // get the user id

    const { content } = req.body
    const { videoId } = req.params
    // console.log(content);
    
    if (!isValidObjectId(videoId)) {
        throw new apiError(401, "Not a valid object id")
    }

    if (content?.trim() === "") {
        throw new apiError(400, "Content cannot be empty")
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: new mongoose.Types.ObjectId(videoId),
        owner: new mongoose.Types.ObjectId(req.user?._id)
    })
    // console.log(comment);
    
    if (!comment) {
        throw new apiError(400, "Something went wrong while creating the comment")
    }

    res.status(200).json(
        new apiResponse(200, comment, "Comment Created Successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    // console.log(content);

    if (!content.trim()) {
        throw new apiError(401, "Content cannot be empty")
    }

    if (!isValidObjectId(commentId)) {
        throw new apiError(401, "Not a valid playlist id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new apiError(501, "Not comment found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(401, "you cannot update the comment as you are not owner")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content.trim()
            }
        },
        { new: true }
    )

    if (!updatedComment) {
        throw new apiError(501, "Something went wrong while updating the playlist")
    }


    res.status(200).json(
        new apiResponse(200, updatedComment, "Comment updated successfully")
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new apiError(401, "Not a valid playlist id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new apiError(501, "Not comment found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(401, "you cannot update the comment as you are not owner")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)


    if (!deletedComment) {
        throw new apiError(401, "Something went wrong while delteing the comment")
    }

    res.status(200).json(
        new apiResponse(200, deletedComment, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}