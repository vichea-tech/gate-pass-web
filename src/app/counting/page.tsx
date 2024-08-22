import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Page from "@/components/Dashboard/Counting";

export const metadata: Metadata = {
  title: "Counting",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Counting = () => {
  return (
    <DefaultLayout>
      <Page />
    </DefaultLayout>
  );
};

export default Counting;
