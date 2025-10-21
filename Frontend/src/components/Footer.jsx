import React from "react";

function Footer() {
  return (
    <footer className="bg-white text-black text-center py-3 mt-auto">
      <p className="mb-0">
        © {new Date().getFullYear()} InternConnect. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
