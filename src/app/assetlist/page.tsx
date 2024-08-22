import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Asset List",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AssetList = () => {
  return (
    <DefaultLayout>
      <p className="text-[30px] text-black-2">Asset List</p>
    </DefaultLayout>
  );
};

export default AssetList;
