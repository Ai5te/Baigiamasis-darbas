import { useState } from "react";

export default function Deposit() {
  const [search, setSearch] = useState({ name: "", surname: "", personalCode: "" });
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setSelectedCustomer(null);
    const res = await fetch("http://localhost:3001/api/customers");
    const allCustomers = await res.json();
    let matches = allCustomers;

    if (search.personalCode) {
      matches = matches.filter(c => c.personalCode === search.personalCode);
    } else {
      if (search.name) {
        matches = matches.filter(c => c.name.toLowerCase() === search.name.toLowerCase());
      }
      if (search.surname) {
        matches = matches.filter(c => c.surname.toLowerCase() === search.surname.toLowerCase());
      }
    }

    setCustomers(matches);
    if (matches.length === 0) {
      setMessage("No customers found.");
    }
    if (matches.length === 1) {
      setSelectedCustomer(matches[0]);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }
    const res = await fetch(`http://localhost:3001/api/customers/${selectedCustomer._id}/deposit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) })
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedCustomer(data);
      setAmount("");
      setMessage("Deposit successful!");
    } else {
      setMessage(data.error || "Deposit failed.");
    }
  };

  return (
    <div className="container mt-5">
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
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Surname"
              value={search.surname}
              onChange={e => setSearch({ ...search, surname: e.target.value })}
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

      {customers.length > 1 && (
        <div className="mb-3">
          <h5>Select a customer:</h5>
          <ul className="list-group">
            {customers.map(c => (
              <li
                key={c._id}
                className="list-group-item"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedCustomer(c)}
              >
                {c.name} {c.surname} (Code: {c.personalCode}, Balance: {c.balance} €)
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCustomer && (
        <div className="card p-3 mb-3">
          <h5>Customer Info</h5>
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Surname:</strong> {selectedCustomer.surname}</p>
          <p><strong>IBAN:</strong> {selectedCustomer.iban}</p>
          <p><strong>Personal Code:</strong> {selectedCustomer.personalCode}</p>
          <p><strong>Balance:</strong> {selectedCustomer.balance} €</p>
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