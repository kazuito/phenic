import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-[100dvh] flex-col md:grid md:grid-cols-[180px,1fr] lg:grid-cols-[240px,1fr]">
      <div className="min-w-0 md:col-start-2">{children}</div>
      <NavBar />
    </div>
  );
};

export default Layout;
