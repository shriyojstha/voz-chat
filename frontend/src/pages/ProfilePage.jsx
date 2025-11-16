import React, { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingPfp, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64img = reader.result;
      setSelectedImg(base64img);
      await updateProfile({ profilePic: base64img });
    };
  };

  return (
    <div className="h-full  pt-20">
      <div className="max-w-2xl  mx-auto p-4 py-8">
        <div className="rounded-xl bg-base-300 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Information</p>
          </div>

          {/* Avatar upload */}
          <div className=" flex items-center flex-col gap-4">
            <div className="relative ">
              <img
                src={selectedImg || authUser.profilePic || "./avatar.png"}
                alt="Profile Pic"
                className="size-32 rounded-full object-cover border-2"
              />
              <label
                htmlFor="avatarUpload"
                className={`bg-base-content absolute bottom-0 right-0 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 
                  ${isUpdatingPfp ? "animate-pulse pointer-events-none" : ""}
                  `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  className="hidden"
                  type="file"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={isUpdatingPfp}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingPfp
                ? "Uploading..."
                : "Please Upload your profile pic"}
            </p>
          </div>

          <div className=" space-y-6 ">
            <div className="space-y-1 5">
              <div className=" text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.username}
              </p>
            </div>

            <div className="space-y-1 5">
              <div className=" text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl p-6">
            <h1 className="text-lg font-medium mb-4">Account Information</h1>
            <div className=" space-y-3 text-sm">
              <div className="flex items-center  justify-between py-2 border-b border-zinc-700">
                <span>Member since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>

              <div className="flex items-center  justify-between py-2">
                <span>Account User</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
