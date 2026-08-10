import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const data = [
    { month: "Apr", amount: 400000 },
    { month: "May", amount: 200000 },
    { month: "Jun", amount: 600000 },
    { month: "Jul", amount: 500000 },
    { month: "Aug", amount: 450000 },
    { month: "Sep", amount: 300000 },
    { month: "Oct", amount: 350000 },
    { month: "Nov", amount: 500000 },
    { month: "Dec", amount: 550000 },
  ];
  
  function DisbursementChart() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
  
        <div className="flex items-center justify-between mb-6">
  
          <div>
            <h2 className="text-lg font-bold text-dashboard-text">
              Disbursed Loans
            </h2>
  
            <p className="text-sm text-dashboard-muted">
              Total: ₦8,063,000
            </p>
          </div>
  
          <select className="border border-dashboard-border rounded-lg px-3 py-2 text-sm">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
  
        </div>
  
        <div className="h-[300px]">
  
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
  
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
  
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
              />
  
              <YAxis
                axisLine={false}
                tickLine={false}
              />
  
              <Tooltip />
  
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />
  
            </LineChart>
          </ResponsiveContainer>
  
        </div>
  
      </div>
    );
  }
  
  export default DisbursementChart;