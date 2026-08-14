import { useEffect, useState } from "react";
import { LoanAPI } from "../../services/loanApi";
import { CustomerAPI } from "../../services/customerApi";

function LoanTable() {
  // =====================================================
  // DATA STATES
  // =====================================================

  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);

  // =====================================================
  // MODAL STATES
  // =====================================================

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // =====================================================
  // EDIT STATE
  // =====================================================

  const [editingId, setEditingId] = useState(null);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    interest_rate: "",
    tenor: "",
    status: "pending",
  });

  // =====================================================
  // UI STATES
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH LOANS AND CUSTOMERS
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [loanResponse, customerResponse] =
          await Promise.all([
            LoanAPI.getAll(),
            CustomerAPI.getAll(),
          ]);

        console.log("LOANS:", loanResponse.data);
        console.log("CUSTOMERS:", customerResponse.data);

        setLoans(loanResponse.data);
        setCustomers(customerResponse.data);

        setError("");
      } catch (err) {
        console.error(
          "Failed to load loans and customers:",
          err
        );

        setError("Failed to load loans.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-card-green text-green-600";

      case "pending":
        return "bg-yellow-100 text-yellow-600";

      case "defaulted":
        return "bg-card-red text-red-600";

      case "closed":
        return "bg-card-blue text-blue-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // =====================================================
  // HANDLE FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // OPEN ADD LOAN MODAL
  // =====================================================

  const handleOpenAdd = () => {
    setEditingId(null);

    setForm({
      customer_id: "",
      amount: "",
      interest_rate: "",
      tenor: "",
      status: "pending",
    });

    setShowAddModal(true);
  };

  // =====================================================
  // OPEN EDIT LOAN MODAL
  // =====================================================

  const handleOpenEdit = (loan) => {
    console.log("EDITING LOAN:", loan);

    setEditingId(loan.id);

    setForm({
      customer_id: loan.customer?.id || "",
      amount: loan.amount || "",
      interest_rate: loan.interest_rate || "",
      tenor: loan.tenor || "",
      status: loan.status || "pending",
    });

    // Close View modal
    setSelectedLoan(null);

    // Open Add/Edit modal
    setShowAddModal(true);
  };

  // =====================================================
  // VIEW LOAN
  // =====================================================

  const handleView = (loan) => {
    console.log("SELECTED LOAN:", loan);

    setSelectedLoan(loan);
  };

  // =====================================================
  // DELETE LOAN
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this loan?"
    );

    if (!confirmed) return;

    try {
      await LoanAPI.delete(id);

      // Remove loan from table
      setLoans((prevLoans) =>
        prevLoans.filter((loan) => loan.id !== id)
      );

      // Close modal if deleted loan is currently open
      if (selectedLoan?.id === id) {
        setSelectedLoan(null);
      }
    } catch (err) {
      console.error(
        "Failed to delete loan:",
        err
      );

      alert("Failed to delete loan.");
    }
  };

  // =====================================================
  // CREATE / UPDATE LOAN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        console.log(
          "UPDATING LOAN:",
          editingId,
          form
        );

        response = await LoanAPI.update(
          editingId,
          form
        );

        setLoans((prevLoans) =>
          prevLoans.map((loan) =>
            loan.id === editingId
              ? response.data
              : loan
          )
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        console.log(
          "CREATING LOAN:",
          form
        );

        response = await LoanAPI.create(form);

        setLoans((prevLoans) => [
          ...prevLoans,
          response.data,
        ]);
      }

      // =================================================
      // RESET FORM
      // =================================================

      setForm({
        customer_id: "",
        amount: "",
        interest_rate: "",
        tenor: "",
        status: "pending",
      });

      setEditingId(null);
      setShowAddModal(false);

    } catch (err) {
      console.error(
        "Unable to save loan:",
        err
      );

      // Very useful when Django returns 400
      console.log(
        "DJANGO ERROR:",
        err.response?.data
      );

      alert(
        err.response?.data
          ? JSON.stringify(
              err.response.data
            )
          : "Unable to save loan."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-dashboard-muted">
          Loading loans...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-lg font-bold">
            Loans
          </h2>

          <p className="text-sm text-dashboard-muted">
            Manage customer loans
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sidebar-background text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Add Loan
        </button>

      </div>

      {/* =================================================
          LOAN TABLE
      ================================================= */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="text-left text-dashboard-muted border-b">

              <th className="pb-3">
                Customer
              </th>

              <th className="pb-3">
                Amount
              </th>

              <th className="pb-3">
                Interest
              </th>

              <th className="pb-3">
                Tenor
              </th>

              <th className="pb-3">
                Status
              </th>

              <th className="pb-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loans.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="py-8 text-center text-dashboard-muted"
                >
                  No loans found.
                </td>

              </tr>

            ) : (

              loans.map((loan) => (

                <tr
                  key={loan.id}
                  className="border-b last:border-b-0"
                >

                  {/* CUSTOMER */}

                  <td className="py-4 font-medium">

                    {loan.customer?.customers_name ||
                      "Unknown Customer"}

                  </td>

                  {/* AMOUNT */}

                  <td className="py-4">

                    ₦
                    {Number(
                      loan.amount || 0
                    ).toLocaleString()}

                  </td>

                  {/* INTEREST */}

                  <td className="py-4">

                    {loan.interest_rate}%

                  </td>

                  {/* TENOR */}

                  <td className="py-4">

                    {loan.tenor} months

                  </td>

                  {/* STATUS */}

                  <td className="py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        loan.status
                      )}`}
                    >
                      {loan.status}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleView(loan)
                        }
                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            loan.id
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =================================================
          ADD / EDIT LOAN MODAL
      ================================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <div>

                <h3 className="text-xl font-bold">

                  {editingId
                    ? "Edit Loan"
                    : "Add Loan"}

                </h3>

                <p className="text-sm text-dashboard-muted">

                  {editingId
                    ? "Update loan information"
                    : "Enter loan information"}

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* CUSTOMER */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Customer
                </label>

                <select
                  name="customer_id"
                  value={form.customer_id}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                >

                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (

                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.customers_name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Loan Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter loan amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />

              </div>

              {/* INTEREST */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Interest Rate (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="interest_rate"
                  placeholder="Enter interest rate"
                  value={
                    form.interest_rate
                  }
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />

              </div>

              {/* TENOR */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Tenor (Months)
                </label>

                <input
                  type="number"
                  name="tenor"
                  placeholder="Enter tenor"
                  value={form.tenor}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="closed">
                    Closed
                  </option>

                  <option value="defaulted">
                    Defaulted
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-brand-blue text-white hover:opacity-90 disabled:bg-gray-400"
                >

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Loan"
                    : "Create Loan"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW LOAN MODAL
      ================================================= */}

      {selectedLoan && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setSelectedLoan(null)
          }
        >

          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

              <div>

                <h3 className="text-xl font-bold">
                  Loan Details
                </h3>

                <p className="text-sm text-dashboard-muted">
                  Customer loan information
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedLoan(null)
                }
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            {/* LOAN INFORMATION */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* CUSTOMER */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Customer
                </p>

                <p className="font-semibold mt-1">
                  {selectedLoan.customer
                    ?.customers_name ||
                    "Unknown Customer"}
                </p>

              </div>

              {/* AMOUNT */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Loan Amount
                </p>

                <p className="font-semibold mt-1">
                  ₦
                  {Number(
                    selectedLoan.amount || 0
                  ).toLocaleString()}
                </p>

              </div>

              {/* INTEREST */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Interest Rate
                </p>

                <p className="font-semibold mt-1">
                  {selectedLoan.interest_rate}%
                </p>

              </div>

              {/* TENOR */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Tenor
                </p>

                <p className="font-semibold mt-1">
                  {selectedLoan.tenor} months
                </p>

              </div>

              {/* MONTHLY PAYMENT */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Monthly Payment
                </p>

                <p className="font-semibold mt-1">
                  ₦
                  {Number(
                    selectedLoan.monthly_payment ||
                      0
                  ).toLocaleString()}
                </p>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Loan Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    selectedLoan.status
                  )}`}
                >
                  {selectedLoan.status}
                </span>

              </div>

              {/* CREATED AT */}

              <div>

                <p className="text-sm text-dashboard-muted">
                  Created At
                </p>

                <p className="font-semibold mt-1">

                  {selectedLoan.created_at
                    ? new Date(
                        selectedLoan.created_at
                      ).toLocaleDateString()
                    : "N/A"}

                </p>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  handleOpenEdit(
                    selectedLoan
                  )
                }
                className="flex-1 bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition"
              >
                Edit Loan
              </button>

              <button
                onClick={() =>
                  setSelectedLoan(null)
                }
                className="flex-1 bg-brand-blue text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default LoanTable;