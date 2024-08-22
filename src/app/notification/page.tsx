import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Test",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const NotificationPage = () => {
  return (
    <DefaultLayout>
      <p className="text-[30px] text-black-2">Notification</p>
    </DefaultLayout>
  );
};

export default NotificationPage;
