import "@/app/scss/base.css";

import Header from "./components/individual/header";
import Overlay from "./utils/OverlayScreen";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Overlay />
        <Header />
        {children}
      </body>
    </html>
  );
}
