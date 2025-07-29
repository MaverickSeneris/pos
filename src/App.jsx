import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Receipts from "./pages/Receipts";
import { useState, useEffect } from "react";

// \U0001f9e0 This component highlights the active link
function NavBar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-2 py-1 rounded transition ${
      location.pathname === path
        ? "text-yellow-300 font-bold"
        : "text-white hover:text-yellow-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-blue-900 p-4 flex gap-4 text-sm border-b border-blue-800">
      <Link to="/" className={linkClass("/")}>
        POS
      </Link>
      <Link to="/dashboard" className={linkClass("/dashboard")}>
        Dashboard
      </Link>
      <Link to="/inventory" className={linkClass("/inventory")}>
        Inventory
      </Link>
      <Link to="/receipts" className={linkClass("/receipts")}>
        Receipts
      </Link>
    </nav>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  const handleLogin = (password) => {
    if (password === import.meta.env.VITE_DASHBOARD_PASSWORD) {
      localStorage.setItem("auth", "true");
      setAuthenticated(true);
    }
  };

  useEffect(() => {
    const existingInventory = localStorage.getItem("inventory");
    const existingSales = localStorage.getItem("sales");

    if (!existingInventory) {
      const sampleInventory = [
        {
          id: "1",
          name: "Shin Ramyun",
          category: "Noodles",
          price: 55,
          stock: 100,
        },
        {
          id: "2",
          name: "Choco Pie",
          category: "Snacks",
          price: 35,
          stock: 80,
        },
        {
          id: "3",
          name: "Banana Milk",
          category: "Drinks",
          price: 45,
          stock: 60,
        },
      ];
      localStorage.setItem("inventory", JSON.stringify(sampleInventory));
    }

    if (!existingSales) {
      localStorage.setItem("sales", JSON.stringify([]));
    }
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<POS />} />
        <Route
          path="/dashboard"
          element={
            authenticated ? <Dashboard /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/inventory"
          element={
            authenticated ? <Inventory /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
