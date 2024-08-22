import { Metadata } from "next";
import RegisterForm from "@/components/Visitor/registerForm";

export const metadata: Metadata = {
    title: "Register",
};

export default function VisitorRegister() {
    return <RegisterForm/>
};