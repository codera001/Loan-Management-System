import { useEffect, useState } from "react";

import { CustomerAPI } from "../services/customerApi";
import { LoanAPI } from "../services/loanApi";

import OverviewCard from "../components/customers/OverviewCard";
import CustomersList from "../components/customers/CustomersList";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [customerResponse, loanResponse] =
          await Promise.all([
            CustomerAPI.getAll(),
            LoanAPI.getAll(),
          ]);

        console.log("Customers:", customerResponse.data);
        console.log("Loans:", loanResponse.data);

        setCustomers(customerResponse.data);
        setLoans(loanResponse.data);

        setError("");
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // TOTAL CUSTOMERS
  // =========================

  const totalCustomers = customers.length;

  // =========================
  // CUSTOMERS WITH ACTIVE LOANS
  // =========================

  const activeCustomerIds = new Set(
    loans
      .filter(
        (loan) =>
          loan.status?.toLowerCase() === "active"
      )
      .map((loan) => loan.customer?.id)
  );

  const totalActiveCustomers = activeCustomerIds.size;

  // =========================
  // CUSTOMERS WITH OUTSTANDING LOANS
  // =========================

  const outstandingCustomerIds = new Set(
    loans
      .filter(
        (loan) =>
          loan.status?.toLowerCase() === "active" ||
          loan.status?.toLowerCase() === "pending"
      )
      .map((loan) => loan.customer?.id)
  );

  const totalOutstandingCustomers =
    outstandingCustomerIds.size;

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-background min-h-screen">

      <section className="p-8">

        {/* PAGE TITLE */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Customers
          </h1>

          <p className="text-dashboard-muted">
            Manage and view your customers
          </p>
        </div>

        {/* OVERVIEW CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <OverviewCard
            title="Total Customers"
            amount={totalCustomers.toLocaleString()}
            color="white"
            icon="👥"
          />

          <OverviewCard
            title="Customers with Active Loans"
            amount={totalActiveCustomers.toLocaleString()}
            color="white"
            icon="✓"
          />

          <OverviewCard
            title="Customers with Outstanding Loans"
            amount={totalOutstandingCustomers.toLocaleString()}
            color="white"
            icon="!"
          />

        </div>

        {/* CUSTOMER TABLE */}

        <div className="mt-6">

          <CustomersList
            customers={customers}
            loans={loans}
            setCustomers={setCustomers}
          />

        </div>

      </section>

    </div>
  );
}

export default Customers;