import { useEffect, useState } from "react";
import { LoanAPI } from "../services/loanApi";
import { CustomerAPI } from "../services/customerApi";
import OverviewCard from "../components/loans/OverviewCard";
import LoanTable from "../components/loans/LoanTable";
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

      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
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


   // LOAN CALCULATIONS

   const totalLoans = loans.length;

   const activeLoans = loans.filter(
     (loan) => loan.status?.toLowerCase() === "active"
   );
   const totalActiveLoans = activeLoans.length;

   const defaultedLoans = loans.filter(
     (loan) => loan.status?.toLowerCase() === "defaulted"
   );
   const totalDefaultedLoans = defaultedLoans.length;

   const closedLoans = loans.filter(
     (loan) => loan.status?.toLowerCase() === "closed"
   ); 
   const totalClosedLoans = closedLoans.length;

   const pendingLoans = loans.filter(
     (loan) => loan.status?.toLowerCase() === "pending"
   );
 
   const totalPendingLoans = pendingLoans.length;
 
  
  return (
    <div className="bg-dashboard-background min-h-screen">

    <section className="p-8">

      {/* PAGE TITLE */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Loans
        </h1>

        <p className="text-dashboard-muted">
          Manage and view loans
        </p>
      </div>

      {/* OVERVIEW CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <OverviewCard
            title="Active Loans"
            amount={totalActiveLoans}
            color="white"
            icon="✓"
          />

          <OverviewCard
            title="Pending Loans"
            amount={totalPendingLoans}
            color="white"
            icon="✓"
          />

          <OverviewCard
            title="Overdue Loans"
            amount={totalDefaultedLoans}
            color="red"
            icon="!"
          />

          <OverviewCard
            title="Closed Loans"
            amount={totalClosedLoans}
            color="white"
            icon="₦"
          />

        </div>

        <div className="mt-6">

<LoanTable
/>

</div>
      </section>
    </div>
  );
}

export default Loans;
