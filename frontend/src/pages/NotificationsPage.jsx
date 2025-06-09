import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import {
  ExternalLink,
  Eye,
  MessageSquare,
  ThumbsUp,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted");
    },
  });

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500" />;

      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span className="text-sm">
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span className="text-sm">
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span className="text-sm">
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-3 bg-gray-50/80 hover:bg-gray-100/90 transition-colors rounded-lg border border-gray-200 flex items-center gap-3 w-full max-w-full sm:max-w-xs"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          {" "}
          {/* Added min-w-0 here */}
          <p className="text-sm text-gray-700 font-medium truncate">
            {relatedPost.content}
          </p>
          <p className="text-xs text-gray-500 mt-1">View post</p>
        </div>
        <ExternalLink size={16} className="text-gray-400 flex-shrink-0" />
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg border border-gray-300 ">
          <h1 className="text-2xl font-bold mb-4 md:mb-6 text-center p-6 lg:text-left">
            Notifications
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-600">
              Loading notifications...
            </p>
          ) : notifications && notifications.data.length > 0 ? (
            <ul>
              {notifications.data.map((notification) => (
                <li
                  key={notification._id}
                  className={` text-sm border-b border-gray-300 p-4  transition-all  hover:bg-gray-200 ${
                    !notification.read
                      ? "bg-blue-100  hover:bg-[#96c2f2]"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3 w-full sm:w-auto">
                      {" "}
                      {/* Added w-full sm:w-auto */}
                      <Link
                        to={`/profile/${notification.relatedUser.username}`}
                      >
                        <img
                          src={
                            notification.relatedUser.profilePicture ||
                            "/avatar.png"
                          }
                          alt={notification.relatedUser.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" // Added flex-shrink-0
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* Ensure this div can shrink and its content truncates */}
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-100 rounded-full flex-shrink-0">
                            {" "}
                            {/* Added flex-shrink-0 */}
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm sm:text-base flex-1 min-w-0">
                            {" "}
                            {/* Added flex-1 min-w-0 */}
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto mt-2 sm:mt-0 flex-shrink-0">
                      {" "}
                      {/* Added flex-shrink-0 */}
                      {!notification.read && (
                        <button
                          onClick={() => markAsReadMutation(notification._id)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          deleteNotificationMutation(notification._id)
                        }
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">
              No notification at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
