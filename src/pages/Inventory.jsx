// pages/Inventory.jsx
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const defaultData = [
  {
    id: uuidv4(),
    name: "Samyang Spicy Ramen",
    price: 55,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Noodles",
  },
  {
    id: uuidv4(),
    name: "Banana Milk",
    price: 35,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Choco Pie",
    price: 20,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Pepero Almond",
    price: 40,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Soju (Green Grape)",
    price: 95,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Melona Ice Cream",
    price: 30,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Frozen",
  },
  {
    id: uuidv4(),
    name: "Binggrae Yogurt Drink",
    price: 25,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Topokki (Rice Cake) Pack",
    price: 70,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Food",
  },
  {
    id: uuidv4(),
    name: "Gim Seaweed Snack",
    price: 18,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Corn Tea",
    price: 45,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
];

function Inventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("inventory"));
    if (data && data.length) setInventory(data);
    else {
      setInventory(defaultData);
      localStorage.setItem("inventory", JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (updated) => {
    setInventory(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.price || !form.stock || !form.category) return;
    if (editingId) {
      const updated = inventory.map((item) =>
        item.id === editingId
          ? { ...item, ...form, price: +form.price, stock: +form.stock }
          : item
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newItem = {
        id: uuidv4(),
        name: form.name,
        price: +form.price,
        stock: +form.stock,
        category: form.category,
      };
      saveToStorage([...inventory, newItem]);
    }
    setForm({ name: "", price: "", stock: "", category: "" });
  };

  const handleDelete = (id) => {
    const filtered = inventory.filter((item) => item.id !== id);
    saveToStorage(filtered);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleResetInventory = () => {
    setShowResetPrompt(true);
  };

  const confirmReset = () => {
    if (
      resetPassword.trim() ===
      (import.meta.env.VITE_DASHBOARD_PASSWORD || "").trim()
    ) {
      saveToStorage(defaultData);
      setToast("Inventory has been reset");
      setShowResetPrompt(false);
      setResetPassword("");
      setTimeout(() => setToast(""), 2000);
    } else {
      setToast("Invalid password");
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-4">
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          className="border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          className="border p-2 rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          placeholder="Category"
          className="border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAddOrUpdate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Item
        </button>
        <button
          onClick={handleResetInventory}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Inventory
        </button>
      </div>

      {showResetPrompt && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p className="mb-2 font-semibold">
              Enter password to reset inventory
            </p>
            <input
              type="password"
              className="border p-1 rounded w-full mb-2"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetPrompt(false)}
                className="text-sm px-2 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="text-sm px-2 py-1 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
            {toast && <p className="text-red-500 mt-2 text-sm">{toast}</p>}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">₱{item.price}</td>
                <td className="border p-2">{item.stock}</td>
                <td className="border p-2">{item.category}</td>
                <td className="border p-2 space-x-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
