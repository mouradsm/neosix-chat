"use client";

import { useUser } from "@/context/UserContext";


const UserCard = ({ user }) => {  
  const {selectedUser} = useUser()
  return (
    <div      
      className={`flex flex-row justify-between w-full p-4 my-2 ${selectedUser?.name == user?.name ? 'bg-slate-400' : 'bg-white'} rounded-lg cursor-pointer`}
    >
      <p className="text-black">{user?.name} - {user.id}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 fill-green-500"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default UserCard;
