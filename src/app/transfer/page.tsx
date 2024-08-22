import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TransferForm from "@/components/Transfer/index";

export const metadata: Metadata = {
  title: "Transfer",
};

const TrasferPage = () => {
  return (
    <DefaultLayout>
      <p className="text-[30px] text-black-2">Asset Transfer</p>
      <TransferForm />  
    </DefaultLayout>
  );
};

export default TrasferPage;
