import { Bell, Home, UserPlus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ user }) => {
  return (
    <div className="bg-secondary rounded-lg border border-gray-300 text-sm  ">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${user.bannerImg || "/banner.png"})` }}
        />
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.username}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px]"
          />
          <h2 className="text-lg font-semibold mt-2">{user.name}</h2>
        </Link>
        <p className="text-info">{user.headline}</p>
        <p className="text-info text-xs">
          {user.connections.length} connections
        </p>
      </div>
      <div className="border-t border-gray-300 ml-4 mr-4 py-5">
        <nav>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Home className="mr-2" size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/network"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <UserPlus className="mr-2" size={20} /> My Network
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Bell className="mr-2" size={20} /> Notifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-base-100 p-4 flex items-center ">
        <Link
          className="text-sm font-semibold px-5 py-2 rounded-md hover:bg-primary hover:text-white transition-colors "
          to={`/profile/${user.username}`}
        >
          Visit Your Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
