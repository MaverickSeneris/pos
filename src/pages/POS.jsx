// pages/POS.jsx
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useReactToPrint } from "react-to-print";
import OrderSummary from "../components/OrderSummary";

function POS() {
  // Load inventory from localStorage
  const [inventory, setInventory] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Cart/order state
  const [cart, setCart] = useState([]);

  // Load inventory when component mounts
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("inventory")) || [];
    setInventory(data);
    setFilteredItems(data);
  }, []);

  // Filter by category or search
  useEffect(() => {
    const filtered = inventory.filter((item) => {
      return (
        (category === "All" || item.category === category) &&
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredItems(filtered);
  }, [search, category, inventory]);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:min-h-0">
      {/* Left: Item selection */}
      <div className="w-full md:w-2/3 p-4 relative">
        <div className="sticky top-[72px] bg-white p-2 z-10 shadow rounded flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(inventory.map((i) => i.category))].map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Item list */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-26">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => item.stock > 0 && addToCart(item)}
              className={`
    border rounded p-1 sm:p-2 shadow text-[10px] sm:text-sm 
    transition-transform duration-100
    ${
      item.stock === 0
        ? "opacity-50 cursor-not-allowed bg-red-100"
        : "cursor-pointer hover:bg-gray-100 active:bg-green-100 active:scale-95"
    }
  `}
            >
              <h3 className="font-bold text-xs sm:text-base">{item.name}</h3>
              <p className="text-[10px] sm:text-sm">₱{item.price}</p>
              <p
                className={`text-[10px] sm:text-xs ${
                  item.stock === 0 ? "text-red-500 font-bold" : "text-gray-500"
                }`}
              >
                {item.stock === 0 ? "Out of Stock" : `Stock: ${item.stock}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order Summary */}
      <OrderSummary
        cart={cart}
        setCart={setCart}
        inventory={inventory}
        setInventory={setInventory}
      />
    </div>
  );
}

export default POS;
