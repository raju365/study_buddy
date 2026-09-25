import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F3F1FE]">
      <Navbar />
      {children}
    </div>
  );
}