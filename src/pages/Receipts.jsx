// pages/Receipts.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Receipts() {
  const [sales, setSales] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const receiptRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(data);
  }, []);

 const handleDelete = () => {
   const correctPassword = import.meta.env.VITE_DASHBOARD_PASSWORD;
   if (passwordInput === correctPassword) {
     const updatedSales = sales.filter((s) => s.id !== selected.id);
     localStorage.setItem("sales", JSON.stringify(updatedSales));
     setSales(updatedSales);
     setSelected(null);
     setShowDeleteModal(false);
     setPasswordInput("");
   } else {
     alert("Incorrect password");
   }
 };


  const filterSales = (sale) => {
    const date = new Date(sale.date);
    const now = new Date();

    switch (filter) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "yesterday": {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        y.setHours(0, 0, 0, 0);
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === y.getTime();
      }
      case "week": {
        const w = new Date(now);
        w.setDate(w.getDate() - 7);
        return date >= w && date <= now;
      }
      case "month":
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case "year":
        return date.getFullYear() === now.getFullYear();
      case "range": {
        if (!rangeStart || !rangeEnd) return true;
        const start = new Date(rangeStart);
        const end = new Date(rangeEnd);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      }
      default:
        return true;
    }
  };

  const filteredSales = sales.filter(filterSales);

  const groupedSales = filteredSales.reduce((groups, sale) => {
    const dateKey = new Date(sale.date).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(sale);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSales).sort((a, b) => new Date(b) - new Date(a));

  const handleSelect = (sale) => {
    setSelected(sale);
  };

  const printReceiptOnly = () => {
    if (!receiptRef.current) return;

    const cloned = receiptRef.current.cloneNode(true);

    // Remove the buttons before printing
    const buttons = cloned.querySelectorAll("button");
    buttons.forEach((btn) => btn.remove());

    const content = cloned.innerHTML;
    const win = window.open("", "", "width=300,height=600");

   win.document.write(`
  <html>
    <head>
      <style>
        * {
          font-family: monospace;
          font-size: 10px;
          line-height: 1.3;
        }
        body {
          width: 58mm;
          margin: 0;
          padding: 8px;
        }
        .receipt {
          width: 100%;
        }
        .center {
          text-align: center;
        }
        .bold {
          font-weight: bold;
        }
        .line {
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
        .receipt-line {
          display: flex;
          justify-content: space-between;
        }
        .cut-line {
          text-align: center;
          margin-top: 10px;
          font-size: 10px;
        }
      </style>
    </head>
    <body onload="window.print(); window.close();">
      <div class="receipt">
        

        ${content}

       
      </div>
    </body>
  </html>
`);


    win.document.close();
  };



  return (
    <div className="p-4 md:flex md:gap-4">
      <div className="md:w-1/2 md:max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Receipts</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {["all", "today", "yesterday", "week", "month", "year", "range"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded border text-xs sm:text-sm ${
                  filter === f ? "bg-black text-white" : "bg-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )
          )}
        </div>

        {filter === "range" && (
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="date"
              className="border p-1 rounded"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
            />
            <input
              type="date"
              className="border p-1 rounded"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
            />
          </div>
        )}

        <ul className="space-y-4">
          {sortedDates.map((dateKey) => (
            <li key={dateKey}>
              <h2 className="font-semibold text-sm mb-2">{dateKey}</h2>
              <ul className="space-y-2">
                {groupedSales[dateKey].map((sale) => (
                  <li
                    key={sale.id}
                    className="border p-2 rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelect(sale)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between">
                      <span>{new Date(sale.date).toLocaleString()}</span>
                      <span className="font-semibold">
                        ₱{sale.total.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:w-1/2 mt-6 md:mt-0">
        {selected && (
          <div
            ref={receiptRef}
            className="border p-4 rounded shadow text-xs print-receipt"
          >
            <h2 className="text-center font-bold mb-2 text-sm center">
              Korean Mart
            </h2>
            <p className="text-center center">Brgy. Sta. Rosa, Rizal, Laguna</p>
            <div className="text-center text-[10px] mb-2 center">
              Receipt ID: {selected.id}
            </div>
            <hr className="my-2 border-dashed" />

            <div>
              {selected.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.qty}
                  </span>
                  <span>₱{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2 border-dashed" />
              <div className="flex justify-between">
                <span>Total:</span>
                <span>₱{selected.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash:</span>
                <span>₱{selected.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Change:</span>
                <span>₱{selected.change.toFixed(2)}</span>
              </div>
              <hr className="my-2 border-dashed" />

              <p className="text-center center">Thank you! 감사합니다!</p>
            </div>

            <div className="flex gap-2 mt-4 print:hidden">
              <button
                onClick={printReceiptOnly}
                className="w-full bg-green-600 text-white py-2 rounded text-sm"
              >
                Print Again
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-500 text-white py-2 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
            <p className="mb-2">Enter password to delete this receipt:</p>
            <input
              type="password"
              className="border w-full p-2 rounded mb-4"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Receipts;
