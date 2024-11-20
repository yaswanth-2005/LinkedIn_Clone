import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Loader, Trash2 } from "lucide-react";

const DeletePostButton = ({ post }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post Deleted Successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete post!");
    },
  });

  const handleDelete = () => {
    deletePost();
  };

  return (
    <>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => setIsModalOpen(true)}
      >
        {isDeletingPost ? (
          <Loader size={18} className="animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this post?
            </h3>
            <p className="py-4">
              This action cannot be undone. Please confirm your decision.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isDeletingPost}
              >
                {isDeletingPost ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
              <button
                className="btn"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeletingPost}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePostButton;
