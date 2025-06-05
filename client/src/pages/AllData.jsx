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

  useEffect(() => {
    fetch("http://localhost:3001/api/customers")
      .then(res => res.json())
      .then(setCustomers);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("surname", form.surname);
    formData.append("iban", form.iban);
    formData.append("idCode", form.personalCode);
    if (form.passport) formData.append("passport", form.passport);

    const res = await fetch("http://localhost:3001/api/customers", {
      method: "POST",
      body: formData,
    });
    const newCustomer = await res.json();
    setCustomers([...customers, newCustomer]);
    setShowForm(false);
    setForm({
      name: "",
      surname: "",
      iban: "",
      personalCode: "",
      passport: null,
      balance: 0
    });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/customers/${id}`, { method: "DELETE" });
    setCustomers(customers.filter(c => c._id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
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
          {/* <div className="mb-2">
            <input
              type="text"
              name="iban"
              placeholder="IBAN Number"
              value={form.iban}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div> */}
          <div className="mb-2">
            <input
              type="text"
              name="personalCode"
              placeholder="Personal Code"
              value={form.idCode}
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
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success me-2">Add</button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
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
            <th>Passport</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{c.surname}</td>
              <td>{c.iban}</td>
              <td>{c.personalCode}</td>
              <td>{c.balance}</td>
              <td>
                {/* {c.passport && (
                  <img
                    src={URL.createObjectURL(c.passport)}
                    alt="Passport"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                )} */}

                {c.passport && 
                <img src={`data:image/jpeg;base64,${c.passport}`} 
                alt="Passport" 
                style={{ width: 50, height: 50, objectFit: "cover" }} 
                />}
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}