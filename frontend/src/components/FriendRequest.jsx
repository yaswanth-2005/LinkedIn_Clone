import React from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest, isPending: acceptLoading } =
    useMutation({
      mutationFn: (requestId) =>
        axiosInstance.put(`/connections/accept/${requestId}`),
      onSuccess: () => {
        toast.success("Connection Request accepted!");
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });

  const { mutate: rejectConnectionRequest, isPending: rejectLoading } =
    useMutation({
      mutationFn: (requestId) =>
        axiosInstance.put(`/connections/reject/${requestId}`),
      onSuccess: () => {
        toast.success("Request rejected!");
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response.data.error);
      },
    });

  return (
    <div className="bg-white rounded-lg border-2 border-green-200 shadow-lg p-4 flex items-center justify-between transition-all hover:bg-gray-200">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || "./avatar.png"}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className=" bg-blue-500 shadow-lg shadow-blue-500/50 text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          {acceptLoading ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            "Accept"
          )}
        </button>
        <button
          className="shadow-lg shadow-red-500/50 text-white bg-red-500 px-4 py-2 rounded-md transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          {rejectLoading ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            "Reject"
          )}
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
