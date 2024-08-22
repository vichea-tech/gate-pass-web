import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Profile from "@/components/User/Profile";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Profile",
  };
const ProfilePage = () => {
    return(
        <>
            <DefaultLayout>
                <p className="text-[30px]">Profile</p>
                <Profile />
            </DefaultLayout>
        </>
    );
}
export default ProfilePage;