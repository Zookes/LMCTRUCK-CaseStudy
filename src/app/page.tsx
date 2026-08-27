"use client";

import { useState } from "react";

type OrderRow = {
  id: number;
  partNumber: string;
  quantity: number;
};

const createRow = (id: number): OrderRow => ({ id, partNumber: "", quantity: 1 });

export default function Home() {
  const [rows, setRows] = useState<OrderRow[]>([createRow(1)]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("Your parts list is empty.");
  const [toast, setToast] = useState("");
  const [nextId, setNextId] = useState(2);

  const showToast = (nextMessage: string) => {
    setToast(nextMessage);
    window.setTimeout(() => setToast(""), 2200);
  };

  const updateRow = (id: number, changes: Partial<OrderRow>) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    );
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createRow(nextId)]);
    setNextId((currentId) => currentId + 1);
  };

  const deleteRow = (id: number) => {
    setRows((currentRows) => {
      const remainingRows = currentRows.filter((row) => row.id !== id);
      return remainingRows.length ? remainingRows : [createRow(nextId)];
    });
    if (rows.length === 1) setNextId((currentId) => currentId + 1);
  };

  const clearAll = () => {
    setRows([createRow(nextId)]);
    setNextId((currentId) => currentId + 1);
    setCartCount(0);
    setMessage("Your parts list is empty.");
  };

  const addToCart = () => {
    const filledRows = rows.filter((row) => row.partNumber.trim());
    if (!filledRows.length) {
      showToast("Enter a part number first");
      return;
    }

    setCartCount(filledRows.length);
    setMessage("Your parts list has items ready to review.");
    showToast("Items added to cart");
  };

  return (
    <>
      <header>
        <nav className="utility-bar" aria-label="Quick navigation">
          <button className="utility-item" type="button" onClick={() => showToast("Menu opened")}>
            <span className="utility-icon menu-icon" aria-hidden="true" />
            <span className="utility-label">Menu</span>
          </button>
          <button className="utility-item" type="button" onClick={() => showToast("Vehicle selector opened")}>
            <span className="utility-icon vehicle-icon" aria-hidden="true" />
            <span className="utility-label">Vehicle Selector</span>
          </button>
          <button className="utility-item" type="button" onClick={() => showToast("Search selected")}>
            <span className="utility-icon search-icon" aria-hidden="true" />
            <span className="utility-label">Search</span>
          </button>
          <button className="utility-item" type="button" aria-label={`Shopping cart, ${cartCount} items`}>
            <span className="utility-icon cart-icon" aria-hidden="true" />
            <span className="cart-count">({cartCount})</span>
          </button>
        </nav>
        <div className="brand-bar"><div className="logo">LF<small>TRUCK PARTS</small></div></div>
        <div className="vehicle-note">No vehicle selected <button type="button" onClick={() => showToast("Vehicle selector opened")}> (select)</button></div>
      </header>

      <main>
        <section className="checkout-steps" aria-label="Checkout progress">
          {['Cart', 'Shipping', 'Payment', 'Confirm', 'Complete'].map((step, index) => (
            <div className={`step${index === 0 ? " active" : ""}`} key={step}>
              <div className="step-number">{index + 1}</div>{step}
            </div>
          ))}
        </section>
        <h1>Quick Order</h1>
        <section className="order-panel" aria-labelledby="order-heading">
          <div className="panel-heading"><strong id="order-heading">Find restoration parts</strong><span className="chevron" aria-hidden="true" /></div>
          <div className="table-scroll">
            <table className="order-table">
              <thead><tr><th scope="col">Part number</th><th scope="col">Quantity</th><th scope="col">Part description</th><th scope="col">Unit price</th><th scope="col">Remove</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td><label className="sr-only" htmlFor={`part-${row.id}`}>Part number</label><input id={`part-${row.id}`} value={row.partNumber} onChange={(event) => updateRow(row.id, { partNumber: event.target.value })} /></td>
                    <td><label className="sr-only" htmlFor={`quantity-${row.id}`}>Quantity</label><input id={`quantity-${row.id}`} type="number" min="1" value={row.quantity} onChange={(event) => updateRow(row.id, { quantity: Math.max(1, Number(event.target.value) || 1) })} /></td>
                    <td className="description" />
                    <td className="price" />
                    <td><button className="delete" type="button" aria-label={`Delete row ${row.id}`} onClick={() => deleteRow(row.id)}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <button type="button" onClick={addRow}>Add Row</button><span />
            <button type="button" onClick={clearAll}>Clear All</button>
            <button type="button" onClick={addToCart}>Add to cart</button>
            <button type="button" onClick={() => showToast("Upload tool is ready for a parts list")}>Upload</button>
          </div>
        </section>
        <p className="empty-message" aria-live="polite">{message}</p>
      </main>

      <footer><div><h2>SUPPORT</h2><a href="#">Contact LF Truck Parts</a><a href="#">Order help</a></div><div><h2>OUR SHOP</h2><a href="#">About LF Truck Parts</a><a href="#">Restoration guides</a></div><div><h2>ORDERS</h2><a href="#">Shipping information</a><a href="#">Returns</a></div><div><h2>RESOURCES</h2><a href="#">Parts catalog</a><a href="#">Vehicle fitment</a></div></footer>
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
