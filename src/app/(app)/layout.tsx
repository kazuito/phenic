import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="md:grid md:grid-cols-[224px,1fr] min-h-[100dvh] flex flex-col">
      <div className="md:col-start-2">{children}</div>
      <NavBar />
    </div>
  );
};

export default Layout;
