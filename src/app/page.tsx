import HomePage from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Languages, TRANSLATIONS } from "@/utils/translate";

const lang = typeof window !== "undefined" ? window.localStorage.getItem("language") || Languages.EN : Languages.EN;
const fontClass = lang === Languages.KH ? "khmer-font" : "";

export const metadata: Metadata = {
  title:
    "Home",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <p className={`text-[30px] text-black-2 ${fontClass}`}>
          {
            lang === Languages.KH
            ? TRANSLATIONS[Languages.KH].dashboard
            : TRANSLATIONS[Languages.EN].dashboard
          }
        </p>
        <HomePage />
      </DefaultLayout>
    </>
  );
}