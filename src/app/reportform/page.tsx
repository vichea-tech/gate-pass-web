import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Report",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ReportFormPage = () => {
  return (
    <DefaultLayout>
      <p className="text-[30px] text-black-2">Report Form</p>
    </DefaultLayout>
  );
};

export default ReportFormPage;
