import { Outlet } from "react-router-dom";

import Header from "./Header";

function Layout() {
  return (
    <div className="layout">
      <div className="layout-header">
        <Header />
      </div>

      <div className="layout-body">
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
