import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 flex flex-col items-center shadow-xl transition-all hover:bg-gray-200">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold text-lg text-center">{user.name}</h3>
      </Link>
      <p className="text-gray-600 text-center">{user.headline}</p>
      <p className="text-sm text-gray-500 mt-2">
        {user.connections?.length} connections
      </p>
      <button className="mt-4 shadow-lg shadow-blue-400/40 bg-blue-500 text-white px-4 py-2 rounded-md  transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;
