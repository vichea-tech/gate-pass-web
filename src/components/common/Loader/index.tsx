const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black gap-5">
      <div className="h-15 w-15 animate-spin rounded-full border-4 border-solid border-[#EEBA0B] border-t-transparent"></div>
      <h1 className="text-[40px] text-black">Loading</h1>
    </div>
  );
};

export default Loader;
