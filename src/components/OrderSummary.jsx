import { useState, useRef, useEffect } from "react"; // already imported

function OrderSummary({ cart, setCart, inventory, setInventory }) {
  const [cash, setCash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const receiptRef = useRef();

  // Restore Cart form localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = parseFloat(cash || 0) - total;

  const printReceiptOnly = () => {
    if (!receiptRef.current) return;

    const cloned = receiptRef.current.cloneNode(true);
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
        .line {
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
        .receipt-line {
          display: flex;
          justify-content: space-between;
        }
        .bold {
          font-weight: bold;
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
        <div class="center bold">Korean Mart</div>
        <div class="center">Brgy. Sta. Rosa, Rizal, Laguna</div>
        <div class="center">Receipt #: ${receiptId}</div>
        
        <div class="line"></div>

       ${cart
         .map(
           (item) => `
          <div class="receipt-line">
            <span>${item.name} x${item.qty}</span>
            <span>₱${(item.price * item.qty).toFixed(2)}</span>
          </div>
        `
         )
         .join("")}

        <div class="line"></div>

        <div class="receipt-line bold">
          <span>Total:</span>
          <span>₱${total.toFixed(2)}</span>
        </div>
        <div class="receipt-line">
          <span>Cash:</span>
          <span>₱${parseFloat(cash || 0).toFixed(2)}</span>
        </div>
        <div class="receipt-line">
          <span>Change:</span>
          <span>₱${change.toFixed(2)}</span>
        </div>

        <div class="line"></div>
        <div class="center">Thank you! 감사합니다!</div>

        <div class="cut-line">------------------------------</div>
      </div>
    </body>
  </html>
`);

    win.document.close();
  };

  const handleCheckout = () => {
    const newSale = {
      id: receiptId,
      items: cart,
      total,
      cash: parseFloat(cash || 0),
      change,
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("sales")) || [];
    localStorage.setItem("sales", JSON.stringify([...existing, newSale]));

    setCart([]);
    localStorage.removeItem("cart");

    const updatedInventory = inventory.map((item) => {
      const cartItem = cart.find((c) => c.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.qty };
      }
      return item;
    });
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));

    setCash("");

    printReceiptOnly();
    setTimeout(() => setShowModal(false), 500);
  };

  const isCashSufficient = parseFloat(cash) >= total;

  return (
    <div
      className="w-full md:w-1/3 bg-white p-2 sm:p-4 shadow-lg border border-t md:border-t-0 
  sticky bottom-0 mt-auto z-40 
  md:static md:top-[72px] md:right-0 md:h-screen md:overflow-y-auto 
  text-xs sm:text-sm mb-20"
    >
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      <div className="mb-2 space-y-2">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-[10px] sm:text-sm"
          >
            <div className="flex flex-col">
              <span>
                {item.name}{" "}
                <span className="font-bold text-gray-700">x{item.qty}</span>
              </span>

              <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-sm">
                <button
                  onClick={() => {
                    if (item.qty > 1) {
                      // Decrease cart qty
                      setCart((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, qty: i.qty - 1 } : i
                        )
                      );

                      // Restore 1 stock to inventory
                      setInventory((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, stock: i.stock + 1 } : i
                        )
                      );
                    } else {
                      // If qty is 1, remove item and restore 1 stock
                      setCart((prev) => prev.filter((i) => i.id !== item.id));
                      setInventory((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, stock: i.stock + 1 } : i
                        )
                      );
                    }
                  }}
                  className="px-2 bg-gray-200 rounded hover:bg-gray-300 active:scale-90 transition"
                >
                  −
                </button>

                <span className="px-2 font-semibold">{item.qty}</span>
                <button
                  onClick={() => {
                    // Check if there's stock left in inventory before adding
                    const itemInInventory = inventory.find(
                      (i) => i.id === item.id
                    );
                    if (itemInInventory?.stock > 0) {
                      // Add 1 to cart
                      setCart((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                        )
                      );

                      // Subtract 1 from inventory stock
                      setInventory((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, stock: i.stock - 1 } : i
                        )
                      );
                    }
                  }}
                  className="px-2 bg-gray-200 rounded hover:bg-gray-300 active:scale-90 transition"
                >
                  +
                </button>
              </div>
            </div>
            <span className="text-sm font-medium">
              ₱{(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <button
          onClick={() => {
            setCart([]);
            setCash("");
            localStorage.removeItem("cart"); // <- add this
          }}
          className="mt-2 w-full bg-red-100 text-red-600 py-1 sm:py-2 text-[11px] sm:text-base rounded hover:bg-red-200 active:scale-95 transition"
        >
          Reset Order
        </button>
      )}

      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-semibold text-[11px] sm:text-sm">
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </div>

        <div className="mt-2">
          <label className="text-sm">Cash Paid:</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            className="border p-1 rounded w-full"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span>Change:</span>
          <span className={change < 0 ? "text-red-500" : ""}>
            ₱{change.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        className="mt-4 w-full bg-green-600 text-white py-1 sm:py-4 text-[11px] sm:text-base rounded disabled:bg-gray-300 disabled:text-gray-500
    active:scale-95 active:bg-green-700 transition"
        onClick={() => {
          const now = new Date();
          const id = `R-${now
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 12)}${now.getMilliseconds()}`;

          setReceiptId(id);
          setShowModal(true);
        }}
        disabled={total === 0 || !isCashSufficient}
      >
        Print Receipt
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div ref={receiptRef}>
              <div className="receipt-print w-[58mm] mx-auto font-mono text-[10px]">
                <h2 className="font-bold text-center text-xs">Korean Mart</h2>
                <p className="text-center">Brgy. Sta. Rosa, Rizal, Laguna</p>
                <p className="text-center mb-1">Receipt #: {receiptId}</p>
                <div className="border-t border-b py-1 my-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} x{item.qty}
                      </span>
                      <span>₱{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span>₱{parseFloat(cash || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Change:</span>
                  <span>₱{change.toFixed(2)}</span>
                </div>
                <p className="text-center mt-2">Thank you! 감사합니다!</p>
              </div>
            </div>

            <div className="flex justify-between mt-4 no-print">
              <button
                onClick={handleCheckout}
                className="bg-black text-white px-2 py-1 rounded text-xs"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
