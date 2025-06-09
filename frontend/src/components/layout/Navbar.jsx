import React from "react";
import { axiosInstance } from "../../lib/axios.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    retry: false,
  });

  // const { data: notifications } = useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: async () => {
  //     try {
  //       const res = await axiosInstance.get("/notifications");
  //       return res.data.data || [];
  //     } catch (error) {
  //       console.error("Failed to fetch notifications:", error);
  //       return [];
  //     }
  //   },
  //   enabled: !!authUser?.id,
  // });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
    // enabled: !!authUser?.id,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"), // Changed to return the full Axios response
    // enabled: !!authUser?.id,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  // console.log("Notifications data:", notifications);
  const notificationsArray = notifications?.data;
  const unreadNotificationCount = Array.isArray(notificationsArray)
    ? notificationsArray.filter((notif) => !notif?.read).length
    : 0;

  // {
  //   notifications.data.map((notif) => {
  //     console.log(notif);
  //   });
  // }

  // const unreadNotif = notifications.filter((notif) => !notif.read);
  // console.log(unreadNotif);

  // const unreadNotificationCount =
  //   notifications?.filter((notif) => !notif.read).length || 0;

  // console.log(notifications);

  const connectionRequestsArray = connectionRequests?.data;
  const unreadConnectionRequestCount = Array.isArray(connectionRequestsArray)
    ? connectionRequestsArray.length
    : 0;
  // console.log(unreadNotificationCount);
  // console.log(unreadConnectionRequestCount);

  return (
    <nav className="bg-secondary shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                className="h-8 rounded"
                src="/small-logo.png"
                alt="LinkedIn"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to="/"
                  className="text-neutral flex flex-col items-center"
                >
                  <Home size={20} />
                  <span className="md:block text-xs font-normal">Home</span>
                </Link>

                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs md:block font-normal">
                    My Network
                  </span>
                  {unreadConnectionRequestCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadConnectionRequestCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs md:block font-normal">
                    Notifications
                  </span>
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-xs md:block font-normal">Me</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <LogOut size={20} />
                  <span className="md:inline font-normal">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
