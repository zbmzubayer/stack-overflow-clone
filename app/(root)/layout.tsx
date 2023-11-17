import Header from './_components/header';
import LeftSidebar from './_components/left-sidebar';
import RightSidebar from './_components/right-sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex min-h-screen flex-1 flex-col px-6 pt-5 max-md:pb-14 sm:px-14">
          {children}
        </main>
        <RightSidebar />
      </div>
      {/* Toaster */}
    </>
  );
}
