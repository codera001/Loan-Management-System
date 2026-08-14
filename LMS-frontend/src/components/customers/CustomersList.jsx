import { useEffect, useState } from "react";

import { CustomerAPI } from "../../services/customerApi";
import { LoanAPI } from "../../services/loanApi";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add/Edit form
  const [form, setForm] = useState({
    customers_name: "",
    customers_email: "",
    customers_phone: "",
    
  });

  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH CUSTOMERS AND LOANS
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [customerResponse, loanResponse] =
          await Promise.all([
            CustomerAPI.getAll(),
            LoanAPI.getAll(),
          ]);

        console.log("CUSTOMERS:", customerResponse.data);
        console.log("LOANS:", loanResponse.data);

        setCustomers(customerResponse.data);
        setLoans(loanResponse.data);

        setError("");
      } catch (err) {
        console.error("Failed to fetch data:", err);

        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // GET CUSTOMER LOANS
  // ==========================================

  const getCustomerLoans = (customerId) => {
    return loans.filter(
      (loan) => loan.customer?.id === customerId
    );
  };

  // ==========================================
  // GET CUSTOMER LOAN STATUS
  // ==========================================

  const getLoanStatus = (customerId) => {
    const customerLoans = getCustomerLoans(customerId);

    if (customerLoans.length === 0) {
      return "No Loan";
    }

    if (
      customerLoans.some(
        (loan) =>
          loan.status?.toLowerCase() === "active"
      )
    ) {
      return "Active";
    }

    if (
      customerLoans.some(
        (loan) =>
          loan.status?.toLowerCase() === "pending"
      )
    ) {
      return "Pending";
    }

    if (
      customerLoans.some(
        (loan) =>
          loan.status?.toLowerCase() === "defaulted"
      )
    ) {
      return "Defaulted";
    }

    if (
      customerLoans.some(
        (loan) =>
          loan.status?.toLowerCase() === "closed"
      )
    ) {
      return "Closed";
    }

    return "No Loan";
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-card-green text-green-600";

      case "Pending":
        return "bg-yellow-100 text-yellow-600";

      case "Defaulted":
        return "bg-card-red text-red-600";

      case "Closed":
        return "bg-card-blue text-blue-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // OPEN ADD CUSTOMER MODAL
  // ==========================================

  const handleOpenAdd = () => {
    setForm({
      customers_name: "",
      customers_email: "",
      customers_phone: "",
    });

    setShowAddModal(true);
  };

  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      console.log("ADDING CUSTOMER:", form);

      const response = await CustomerAPI.create(form);

      console.log(
        "CUSTOMER CREATED:",
        response.data
      );

      // Add new customer to table
      setCustomers((previous) => [
        ...previous,
        response.data,
      ]);

      // Close modal
      setShowAddModal(false);

      // Clear form
      setForm({
        customers_name: "",
        customers_email: "",
        customers_phone: "",
      });

      alert("Customer added successfully.");

    } catch (err) {
      console.error(
        "Failed to create customer:",
        err
      );

      console.log(
        "Server response:",
        err.response?.data
      );

      alert(
        err.response?.data?.detail ||
        "Unable to add customer."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // VIEW CUSTOMER
  // ==========================================

  const handleView = async (id) => {
    try {
      const response = await CustomerAPI.get(id);

      console.log(
        "CUSTOMER DETAILS:",
        response.data
      );

      setSelectedCustomer(response.data);

    } catch (err) {
      console.error(
        "Failed to fetch customer:",
        err
      );

      alert(
        "Unable to load customer details."
      );
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleOpenEdit = () => {
    if (!selectedCustomer) return;

    setForm({
      customers_name:
        selectedCustomer.customers_name || "",

      customers_email:
        selectedCustomer.customers_email || "",

      customers_phone:
        selectedCustomer.customers_phone || "",
    });

    // Close view modal
    setSelectedCustomer(null);

    // Open edit modal
    setShowEditModal(true);
  };

  // ==========================================
  // UPDATE CUSTOMER
  // ==========================================

  const handleEditCustomer = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) return;

    try {
      setSaving(true);

      console.log(
        "UPDATING CUSTOMER:",
        selectedCustomer.id,
        form
      );

      const response = await CustomerAPI.update(
        selectedCustomer.id,
        form
      );

      console.log(
        "CUSTOMER UPDATED:",
        response.data
      );

      // Update customer in table
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === selectedCustomer.id
            ? response.data
            : customer
        )
      );

      // Close edit modal
      setShowEditModal(false);

      // Clear form
      setForm({
        customers_name: "",
        customers_email: "",
        customers_phone: "",
      });

      alert(
        "Customer updated successfully."
      );

    } catch (err) {
      console.error(
        "Failed to update customer:",
        err
      );

      console.log(
        "Server response:",
        err.response?.data
      );

      alert(
        err.response?.data?.detail ||
        "Unable to update customer."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await CustomerAPI.delete(id);

      // Remove customer
      setCustomers((previous) =>
        previous.filter(
          (customer) => customer.id !== id
        )
      );

      // Remove customer's loans
      setLoans((previous) =>
        previous.filter(
          (loan) => loan.customer?.id !== id
        )
      );

      // Close view modal
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }

      alert(
        "Customer deleted successfully."
      );

    } catch (err) {
      console.error(
        "Failed to delete customer:",
        err
      );

      alert(
        "Unable to delete customer."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-dashboard-muted">
          Loading customers...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-lg font-bold">
            Customers
          </h2>

          <p className="text-sm text-dashboard-muted">
            Manage your customers and their loans
          </p>
        </div>

        {/* ADD CUSTOMER BUTTON */}

        <button
          onClick={handleOpenAdd}
          className="bg-sidebar-background text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Add Customer
        </button>

      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="text-left text-dashboard-muted border-b">

              <th className="pb-3">
                Customer Name
              </th>

              <th className="pb-3">
                Phone Number
              </th>

              <th className="pb-3">
                Email
              </th>

              <th className="pb-3">
                Loan Status
              </th>

              <th className="pb-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="py-8 text-center text-dashboard-muted"
                >
                  No customers found.
                </td>

              </tr>

            ) : (

              customers.map((customer) => {

                const loanStatus =
                  getLoanStatus(customer.id);

                return (

                  <tr
                    key={customer.id}
                    className="border-b last:border-b-0"
                  >

                    <td className="py-4 font-medium">
                      {customer.customers_name}
                    </td>

                    <td className="py-4">
                      {customer.customers_phone}
                    </td>

                    <td className="py-4">
                      {customer.customers_email}
                    </td>

                    <td className="py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          loanStatus
                        )}`}
                      >
                        {loanStatus}
                      </span>

                    </td>

                    <td className="py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleView(customer.id)
                          }
                          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(customer.id)
                          }
                          className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              })

            )}

          </tbody>

        </table>

      </div>

      {/* =================================================
          ADD CUSTOMER MODAL
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

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

              <div>
                <h3 className="text-xl font-bold">
                  Add Customer
                </h3>

                <p className="text-sm text-dashboard-muted">
                  Enter customer information
                </p>
              </div>

              <button
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
              onSubmit={handleAddCustomer}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customers_name"
                  value={form.customers_name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="customers_phone"
                  value={form.customers_phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="customers_email"
                  value={form.customers_email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

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
                    : "Add Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW CUSTOMER MODAL
      ================================================= */}

      {selectedCustomer && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setSelectedCustomer(null)
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
                  Customer Details
                </h3>

                <p className="text-sm text-dashboard-muted">
                  Customer information and loan details
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            {/* CUSTOMER INFORMATION */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <p className="text-sm text-dashboard-muted">
                  Customer Name
                </p>

                <p className="font-semibold mt-1">
                  {selectedCustomer.customers_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-dashboard-muted">
                  Phone Number
                </p>

                <p className="font-semibold mt-1">
                  {selectedCustomer.customers_phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-dashboard-muted">
                  Email
                </p>

                <p className="font-semibold mt-1">
                  {selectedCustomer.customers_email}
                </p>
              </div>

              <div>
                <p className="text-sm text-dashboard-muted">
                  Joined
                </p>

                <p className="font-semibold mt-1">
                  {selectedCustomer.joined_at
                    ? new Date(
                        selectedCustomer.joined_at
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>

                <p className="text-sm text-dashboard-muted">
                  Loan Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    getLoanStatus(
                      selectedCustomer.id
                    )
                  )}`}
                >
                  {getLoanStatus(
                    selectedCustomer.id
                  )}
                </span>

              </div>

            </div>

            {/* LOANS */}

            <div className="mt-6 pt-5 border-t">

              <h4 className="font-bold mb-4">
                Loan Information
              </h4>

              {getCustomerLoans(
                selectedCustomer.id
              ).length === 0 ? (

                <div className="bg-gray-50 rounded-xl p-4 text-center">

                  <p className="text-sm text-dashboard-muted">
                    This customer has no loans.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {getCustomerLoans(
                    selectedCustomer.id
                  ).map((loan) => (

                    <div
                      key={loan.id}
                      className="flex justify-between items-center bg-gray-50 rounded-xl p-4"
                    >

                      <div>

                        <p className="font-medium">
                          ₦
                          {Number(
                            loan.amount || 0
                          ).toLocaleString()}
                        </p>

                        <p className="text-xs text-dashboard-muted">
                          {loan.tenor} months
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          loan.status
                            ?.charAt(0)
                            .toUpperCase() +
                            loan.status?.slice(1)
                        )}`}
                      >
                        {loan.status}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={handleOpenEdit}
                className="flex-1 bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition"
              >
                Edit Customer
              </button>

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="flex-1 bg-brand-blue text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          EDIT CUSTOMER MODAL
      ================================================= */}

      {showEditModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setShowEditModal(false)
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
                  Edit Customer
                </h3>

                <p className="text-sm text-dashboard-muted">
                  Update customer information
                </p>

              </div>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleEditCustomer}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customers_name"
                  value={form.customers_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="customers_phone"
                  value={form.customers_phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="customers_email"
                  value={form.customers_email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
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
                    ? "Updating..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default CustomersList;