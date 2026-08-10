import { useEffect, useState } from "react";
import { LoanAPI } from "../services/loanApi";
import { CustomerAPI } from "../services/customerApi";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    interest_rate: "",
    tenor: "",
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
          setLoading(true);
      
          const [loanRes, customerRes] = await Promise.all([
            LoanAPI.getAll(),
            CustomerAPI.getAll(),
          ]);
          setLoans(loanRes.data);
          setCustomers(customerRes.data);
          setError("");
        } catch (err) {
          setError("Failed to load data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (loan) => {
    setEditingId(loan.id);
    setForm({
      customer_id: loan.customer.id,
      amount: loan.amount,
      interest_rate: loan.interest_rate,
      tenor: loan.tenor,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
  
    try {
      await LoanAPI.delete(id);
  
      setLoans((prevLoans) =>
        prevLoans.filter((loan) => loan.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete loan.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
  
      if (editingId) {
        response = await LoanAPI.update(editingId, form);
  
        setLoans((prevLoans) =>
          prevLoans.map((loan) =>
            loan.id === editingId ? response.data : loan
          )
        );
      } else {
        response = await LoanAPI.create(form);
  
        setLoans((prevLoans) => [...prevLoans, response.data]);
      }
  
      setForm({
        customer_id: "",
        amount: "",
        interest_rate: "",
        tenor: "",
      });
  
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Unable to save loan.");
    }
  };
  if (loading) {
    return <p>Loading loans...</p>;
  }
  
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Loans</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <select
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="interest_rate"
            placeholder="Interest Rate"
            value={form.interest_rate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="tenor"
            placeholder="Term"
            value={form.tenor}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
            {editingId ? "Update Loan" : "Create Loan"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Monthly</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.customer.name}</td>
                <td>₦{loan.amount}</td>
                <td>{loan.status}</td>
                <td>₦{loan.monthly_payment}</td>
                <td>
                  <button onClick={() => handleEdit(loan)}>Edit</button>
                  <button onClick={() => handleDelete(loan.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Loans;
