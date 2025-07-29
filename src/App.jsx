// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Receipts from "./pages/Receipts";
import { useState, useEffect } from "react";

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

  console.log("Expected:", import.meta.env.VITE_DASHBOARD_PASSWORD);


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
      <nav className=" sticky top-0 z-50 bg-gray-100 p-4 flex gap-4 text-sm border-b">
        <Link to="/">POS</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/receipts">Receipts</Link>
      </nav>

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
        <Route
          path="/receipts"
          element={
            authenticated ? <Receipts /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
