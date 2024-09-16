import NavBar from "@/components/NavBar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      {children}
      <NavBar />
    </>
  );
};

export default Layout;
