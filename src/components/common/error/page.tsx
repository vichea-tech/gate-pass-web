import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Error",
};

const ErrorHandlePage = () => {
  return (
    <DefaultLayout>
      <section className="flex items-center min-h-screen p-16 bg-gray-50 dark:bg-gray-700 text-black-2">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-gray-600 dark:text-gray-100">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl md:text-3xl dark:text-gray-300">
              Sorry, we couldn&#39;t find this page.
            </p>
            <a
              href="/"
              className="px-8 py-4 text-xl font-semibold rounded bg-[#EEBA0B] text-gray-50 hover:text-gray-200"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ErrorHandlePage;
