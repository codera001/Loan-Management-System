import { useEffect, useState } from "react";

import { LoanAPI } from "../services/loanApi";

import OverviewCard from "../components/dashboard/OverviewCard";
import StatCard from "../components/dashboard/StatCard";
import DisbursementChart from "../components/dashboard/DisbursmentChart";
import UserRatio from "../components/dashboard/UserRatio";
import RecentActivities from "../components/dashboard/RecentActivities";

function Dashboard() {

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLoans = async () => {

      try {

        const response = await LoanAPI.getAll();

        console.log("Loan data:", response.data);

        setLoans(response.data);

      } catch (error) {

        console.error("Failed to load loans:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchLoans();

  }, []);

  // LOAN CALCULATIONS

  const totalLoans = loans.length;

  const activeLoans = loans.filter(
    (loan) => loan.status?.toLowerCase() === "active"
  );

  const totalActiveLoans = activeLoans.length;

  const totalAmount = loans.reduce(
    (sum, loan) => sum + Number(loan.amount || 0),
    0
  );

  const activeLoanAmount = activeLoans.reduce(
    (sum, loan) => sum + Number(loan.amount || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (

    <div className="bg-dashboard-background min-h-screen">

      {/* =========================
          OVERVIEW
      ========================= */}

      <section className="p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold">
            Overview
          </h2>

          <select className="border rounded-lg px-3 py-2 bg-white">
            <option>Overall</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

        </div>


        {/* TOP CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          <OverviewCard
            title="Disbursed Loans"
            amount={totalAmount.toLocaleString()}
            unit={totalLoans}
            color="blue"
            icon="₦"
          />

          <OverviewCard
            title="Active Loans"
            amount={activeLoanAmount.toLocaleString()}
            unit={totalActiveLoans}
            color="green"
            icon="✓"
          />

          <OverviewCard
            title="Overdue Loans"
            amount="0"
            unit="0"
            color="red"
            icon="!"
          />

          <OverviewCard
            title="Running Loans (Paid)"
            amount="0"
            unit="0"
            color="yellow"
            icon="₦"
          />

          <OverviewCard
            title="Running Loans (Unpaid)"
            amount="0"
            unit="0"
            color="yellow"
            icon="₦"
          />

        </div>


        {/* =========================
            CHART + STATISTICS
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

          {/* CHART */}

          <div className="lg:col-span-2">

            <DisbursementChart />

          </div>


          {/* RIGHT SIDE */}

          <div className="space-y-5">

            <StatCard
              title="Active Users"
              value="10,786"
            />

            <StatCard
              title="Total Users"
              value="20,587"
            />

            <StatCard
              title="Repayment Rate"
              value="80%"
            />

          </div>

        </div>


        {/* =========================
            USER RATIO
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          <div className="lg:col-span-2">

            <RecentActivities />

          </div>

          <UserRatio />

        </div>

      </section>

    </div>
  );
}

export default Dashboard;