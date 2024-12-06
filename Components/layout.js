import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (

    <div className="flex flex-col">
      <Navbar />
      {children}
      

    </div>
  );
}
