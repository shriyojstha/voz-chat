import React, { useEffect, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import SideBarSkeleton from "./Skeleton/SideBarSkeleton";
import { User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const { getUser, setSelectedUser, selectedUser, users, isUserLoading } =
    useMessageStore();
  const {onlineUsers} = useAuthStore();
  const [showOnlineUsr, setShowOnlineUsr] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const filteredUsers = showOnlineUsr ? users.filter(user => onlineUsers.includes(user._id)) : users;

  if (isUserLoading) return <SideBarSkeleton />;
  return (
    <aside className="h-full  w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className=" border-b border-base-300 p-5 w-full">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="hidden lg:block font-medium">Contact</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
            type="checkbox"
            checked={showOnlineUsr}
            onChange={(e) => setShowOnlineUsr(e.target.checked)}
            className="checkbox-sm checkbox rounded-lg"
            />
            <span className="text-sm">show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user, i) => (
          <button key={i} onClick={() => setSelectedUser(user)} className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-all 
            ${selectedUser?.React_id === user._id  ? 'bg-base-300 ring-1 ring-base-300' : '' } 
            `}>
            <div className="relative mx-auto lg:mx-0">
                <img
                src={user.profilePic || '/avatar.png'}
                alt={user.name}
                className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>
                )}
            </div>


                <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.username}</div>
                    <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id) ? "online" : 'offline'}
                    </div>
                </div>

          </button>
        ))}
            {
              filteredUsers.length === 0 && (
                <div className="text-center text-zinc-500">
                  No Online Users
                  </div>
              )
            }
      </div>
    </aside>
  );
};

export default SideBar;
