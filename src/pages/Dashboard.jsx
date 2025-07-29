// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("today");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [itemFilter, setItemFilter] = useState("All");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(all);
  }, []);

  useEffect(() => {
    const now = new Date();
    const filteredSales = sales.filter((sale) => {
      const date = new Date(sale.date);
      const matchDate = (() => {
        switch (filter) {
          case "today":
            return date.toDateString() === now.toDateString();
          case "yesterday":
            const y = new Date(now);
            y.setDate(y.getDate() - 1);
            return date.toDateString() === y.toDateString();
          case "week":
            const w = new Date(now);
            w.setDate(w.getDate() - 7);
            return date >= w && date <= now;
          case "month":
            return (
              date.getMonth() === now.getMonth() &&
              date.getFullYear() === now.getFullYear()
            );
          case "year":
            return date.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      })();

      const matchCategory =
        categoryFilter === "All" ||
        sale.items.some((i) => i.category === categoryFilter);

      const matchItem =
        itemFilter === "All" || sale.items.some((i) => i.name === itemFilter);

      return matchDate && matchCategory && matchItem;
    });
    setFiltered(filteredSales);
  }, [sales, filter, categoryFilter, itemFilter]);

  const allItems = [
    ...new Set(sales.flatMap((sale) => sale.items.map((i) => i.name))),
  ];
  const allCategories = [
    ...new Set(sales.flatMap((sale) => sale.items.map((i) => i.category))),
  ];

  const chartData = {
    labels: filtered.map((sale) => new Date(sale.date).toLocaleTimeString()),
    datasets: [
      {
        label: "Sales (₱)",
        data: filtered.map((sale) => sale.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const totalSales = filtered.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filtered.length;

  const itemSales = {};
  filtered.forEach((sale) => {
    sale.items.forEach((item) => {
      itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
    });
  });
  const bestsellers = Object.entries(itemSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  const handleBackToPOS = () => {
    navigate("/");
  };

  const handleViewReceipts = () => {
    navigate("/receipts");
  };

  return (
    <div className="p-4 pb-24 text-sm md:text-base">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleBackToPOS}
            className="bg-gray-300 hover:bg-gray-400 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-sm rounded"
          >
            POS
          </button>
          <button
            onClick={handleViewReceipts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-sm rounded"
          >
            Receipts
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-sm rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleViewReceipts}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View Receipts
        </button>
      </div> */}

      <div className="flex flex-wrap gap-2 mb-4 text-xs md:text-sm">
        {["today", "yesterday", "week", "month", "year"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded border ${
              filter === f ? "bg-black text-white" : "bg-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="All">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={itemFilter}
          onChange={(e) => setItemFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="All">All Items</option>
          {allItems.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <Bar data={chartData} />

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Sales Summary</h2>
        <div className="text-sm space-y-1">
          <p>Total Transactions: {totalTransactions}</p>
          <p>Total Sales: ₱{totalSales.toFixed(2)}</p>
        </div>

        <ul className="text-xs md:text-sm space-y-1 mt-2">
          {filtered.map((sale) => (
            <li key={sale.id} className="flex justify-between border-b pb-1">
              <span>{new Date(sale.date).toLocaleString()}</span>
              <span>₱{sale.total}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-semibold mt-4 mb-2">Top 5 Bestsellers</h2>
        <ul className="text-xs md:text-sm space-y-1">
          {bestsellers.map(([name, qty]) => (
            <li key={name} className="flex justify-between border-b pb-1">
              <span>{name}</span>
              <span>{qty} sold</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-2 flex justify-center gap-4 border-t md:hidden">
        <button
          onClick={handleBackToPOS}
          className="bg-gray-300 hover:bg-gray-400 text-xs px-3 py-2 rounded"
        >
          Back to POS
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
