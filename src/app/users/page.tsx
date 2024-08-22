import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserList from "@/components/User/index";

export const metadata: Metadata = {
  title: "User",
};

export default function UserManagementPage(){
  return (
    <DefaultLayout>
      <p className="text-[30px] text-black-2">Users</p>
      <UserList />
    </DefaultLayout>
  );
};
