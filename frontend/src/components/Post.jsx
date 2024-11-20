import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useParams } from "react-router-dom";
import PostAction from "./PostAction";
import { Loader, MessageCircle, Send, Share2, ThumbsUp } from "lucide-react";
import DeletePostButton from "./DeletePostButton";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post }) => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const queryClient = useQueryClient();

  //   const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
  //     mutationFn: async () => {
  //       await axiosInstance.delete(`/posts/delete/${post._id}`);
  //     },
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["posts"] });
  //       toast.success("Post Deleted Successfully!");
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   });

  const {
    mutate: createComment,
    isLoading: isAddingComment,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-secondary border-2 border-gray-300 rounded-lg shadow-xl mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-row items-start">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post?.author?.profilePicture || "/avatar.png"}
                alt={post.author.name}
                className="size-10 rounded-full mr-2"
              />
            </Link>

            <div className="mt-[-2px]">
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
                {/* {console.log(post)} */}
              </Link>
              <p className="text-xs text-info">{post.author.headline}</p>
              <p className="text-[10px] text-info">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && <DeletePostButton post={post} />}
        </div>
        <p className="mb-4 ml-2">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post Content"
            className="rounded-lg w-full h-full mb-4 "
          />
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={`${
                  isLiked ? "text-blue-500 fill-blue-300" : ""
                } transition-transform duration-200 active:scale-95 hover:scale-110`}
              />
            }
            text={`Like(${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment(${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text="Share" />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-3 border-2 rounded-lg flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />

                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-info text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              placeholder="&nbsp; Add a Comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow py-2 px-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {/* <Send size={18} /> */}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
