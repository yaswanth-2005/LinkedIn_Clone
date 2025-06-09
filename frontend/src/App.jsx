import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/layout/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");

        // Debugging log
        console.log("Raw API response:", res);

        if (
          typeof res.data === "string" &&
          res.data.startsWith("<!doctype html>")
        ) {
          throw new Error("Backend returned HTML instead of JSON");
        }

        return res.data;
      } catch (err) {
        console.error("Auth check failed:", err);
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        {/* Protected routes */}
        {authUser && (
          <>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </>
        )}
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
    </Layout>
  );
};

export default App;
