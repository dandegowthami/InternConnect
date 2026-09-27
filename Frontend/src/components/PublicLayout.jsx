import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Loader } from "./ui";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="public-main">
        <Suspense fallback={<Loader page />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
