import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/components/Sidebar";
import NewRoutes from "./pages/routes/NewRoutes";
import Login from "./pages/onboarding/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* App Routes with Sidebar */}
          <Route element={<Sidebar />}>
            {NewRoutes?.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
