export default function RightSidebar() {
  return (
    <aside className="background-light900_dark200 light-border sticky right-0 top-20 flex h-[calc(100vh-5rem)] flex-col border-l p-5 shadow-light-300 dark:shadow-none max-xl:hidden max-sm:hidden lg:w-[350px]">
      <div className="">
        <h3 className="h3-bold">Top Questions</h3>
        <div>{/* Questions */}</div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold">Popular Tags</h3>
        <div>{/* tags */}</div>
      </div>
    </aside>
  );
}
