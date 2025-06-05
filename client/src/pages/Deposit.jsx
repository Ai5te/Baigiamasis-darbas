import { useState } from "react";

export default function Deposit() {
  const [search, setSearch] = useState({ name: "", surname: "", personalCode: "" });
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    // Fetch all customers and filter (for demo; for real app, use backend search)
    const res = await fetch("http://localhost:3001/api/customers");
    const customers = await res.json();
    const found = customers.find(c =>
      c.name.toLowerCase() === search.name.toLowerCase() &&
      c.surname.toLowerCase() === search.surname.toLowerCase() &&
      (search.personalCode ? c.personalCode === search.personalCode : true)
    );
    if (found) {
      setCustomer(found);
    } else {
      setCustomer(null);
      setMessage("Customer not found.");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }
    const res = await fetch(`http://localhost:3001/api/customers/${customer._id}/deposit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) })
    });
    const data = await res.json();
    if (res.ok) {
      setCustomer(data);
      setAmount("");
      setMessage("Deposit successful!");
    } else {
      setMessage(data.error || "Deposit failed.");
    }
  };

  return (
    <div className="container">
      <h2>Deposit</h2>
      <form className="mb-3" onSubmit={handleSearch}>
        <div className="row g-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={search.name}
              onChange={e => setSearch({ ...search, name: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Surname"
              value={search.surname}
              onChange={e => setSearch({ ...search, surname: e.target.value })}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Personal Code (optional)"
              value={search.personalCode}
              onChange={e => setSearch({ ...search, personalCode: e.target.value })}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </div>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      {customer && (
        <div className="card p-3 mb-3">
          <h5>Customer Info</h5>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Surname:</strong> {customer.surname}</p>
          <p><strong>IBAN:</strong> {customer.iban}</p>
          <p><strong>Personal Code:</strong> {customer.personalCode}</p>
          <p><strong>Balance:</strong> {customer.balance} €</p>
          <form onSubmit={handleDeposit} className="row g-2 align-items-center">
            <div className="col-auto">
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-success" type="submit">Add Funds</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}