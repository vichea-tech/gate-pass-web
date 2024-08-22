import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Page from "@/components/Dashboard/Room";

export const metadata: Metadata = {
  title: "Room",
};

const Room = () => {
  return (
    <DefaultLayout>
      <div className="ml-3">
        <Page />
      </div>
    </DefaultLayout>
  );
};

export default Room;
