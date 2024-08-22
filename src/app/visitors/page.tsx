import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VisitorList from "@/components/Visitor/index";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visitor",
};

export default function Visitor() {
    return (
        <DefaultLayout>
            <p className="text-[30px] text-black-2">Visitors</p>
            <VisitorList />
        </DefaultLayout>
    );
};