import { useState, useEffect } from "react";

export default function AllData() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    iban: "",
    personalCode: "",
    passport: null,
    balance: 0
  });
  const [message, setMessage] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:3001/api/customers")
      .then(res => res.json())
      .then(setCustomers)
      .catch(() => setMessage("Failed to load customers"));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "passport") {
      setForm({ ...form, passport: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("surname", form.surname);
    formData.append("personalCode", form.personalCode);
    if (form.passport) formData.append("passport", form.passport);

    const res = await fetch("http://localhost:3001/api/customers", {
      method: "POST",
      body: formData,
    });
    const newCustomer = await res.json();
    if (res.ok) {
      setCustomers([...customers, newCustomer]);
      setShowForm(false);
      setForm({
        name: "",
        surname: "",
        personalCode: "",
        passport: null,
        balance: 0
      });
      setMessage("Customer successfully added!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(newCustomer.error || "Failed to add customer");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
  const res = await fetch(`http://localhost:3001/api/customers/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (res.ok && data.success) {
    setCustomers(customers.filter(c => c._id !== id));
    setMessage("Customer deleted successfully.");
    setTimeout(() => setMessage(""), 3000);
  } else {
    setMessage(data.error || "Cannot delete account.");
    setTimeout(() => setMessage(""), 3000);
  }
};

function handleEditClick(customer) {
  setEditingCustomer(customer);
}

const totalPages = Math.ceil(customers.length / itemsPerPage);
const paginatedCustomers = customers
  .slice()
  .sort((a, b) => a.surname.localeCompare(b.surname))
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mt-5">
      <h2>Customers</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <button className="btn btn-outline-success mb-3" onClick={() => setShowForm(true)}>
        Add New Customer
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={form.surname}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="personalCode"
              placeholder="Personal Code"
              value={form.personalCode}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              type="file"
              name="passport"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success me-2">Add</button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {editingCustomer && (
        <form
          className="mb-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch(`http://localhost:3001/api/customers/${editingCustomer._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editingCustomer),
            });
            const updated = await res.json();
            if (res.ok) {
              setCustomers(customers.map(c => c._id === updated._id ? updated : c));
              setEditingCustomer(null);
              setMessage("Customer updated!");
              setTimeout(() => setMessage(""), 3000);
            } else {
              setMessage(updated.error || "Update failed.");
            }
          }}
        >
          <h5>Edit Customer</h5>
          <input
            type="text"
            value={editingCustomer.name}
            onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
            className="form-control mb-2"
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={editingCustomer.surname}
            onChange={e => setEditingCustomer({ ...editingCustomer, surname: e.target.value })}
            className="form-control mb-2"
            placeholder="Surname"
            required
          />
          <input
           type="text" 
           placeholder="Personal Code"
            value={editingCustomer.personalCode}
            onChange={e => setEditingCustomer({ ...editingCustomer, personalCode: e.target.value })}
            className="form-control mb-2"
            required
           />
          <button className="btn btn-success me-2" type="submit">Save</button>
          <button className="btn btn-secondary" type="button" onClick={() => setEditingCustomer(null)}>Cancel</button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>IBAN</th>
            <th>Personal code</th>
            <th>Balance</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{c.surname}</td>
              <td>{c.iban}</td>
              <td>{c.personalCode}</td>
              <td>{c.balance}</td>
              <td className="button-cell">
                <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleDelete(c._id)}
                style={{ width: '70px' }}
                >
                  Delete
                </button>
              </td>
              <td className="button-cell">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEditClick(c)}
                  title="Edit"
                  style={{ width: '70px' }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <div className="d-flex justify-content-center my-3">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="align-self-center">Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
          </div>
    </div>
  );
}