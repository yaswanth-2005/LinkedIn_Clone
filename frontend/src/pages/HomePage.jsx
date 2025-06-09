import { useQuery } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { UsersIcon } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // console.log({ authUser });

  const {
    data: recommendedUsers,
    isLoading: isLoadingRecommendedUsers,
    isError: isErrorRecommendedUsers,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  if (isLoadingPosts || isLoadingRecommendedUsers) {
    return <div>Loading...</div>;
  }

  if (isErrorPosts || isErrorRecommendedUsers) {
    return <div>Error loading data</div>;
  }

  // Ensure both posts and recommendedUsers are arrays before mapping
  const postList = Array.isArray(posts) ? posts : [];
  const recommendedUserList = Array.isArray(recommendedUsers)
    ? recommendedUsers
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className=" lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />

        {postList.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {postList.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center">
            <div className="mb-6">
              <UsersIcon size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet!
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      {recommendedUserList.length > 0 && (
        <div className="col-span-1 lg:col-span-1 block lg:block">
          <div className="bg-secondary rounded-lg  border border-gray-300 p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUserList.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
