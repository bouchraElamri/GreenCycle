import Navbar from "./Navbar";
import Footer from "./Footer";


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className=" px-6">{children}           
      </main>
      <Footer />
    </>
  );
}