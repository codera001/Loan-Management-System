const activities = [
    {
      customer: "Godwin",
      staff: "Timi",
      amount: "₦200,000",
      date: "Wed, Feb 15 2023",
      time: "10:45 AM",
      type: "Disbursed",
    },
    {
      customer: "Oluwadasimi",
      staff: "Mobolaji",
      amount: "₦10,000",
      date: "Sun, Feb 12 2023",
      time: "01:15 PM",
      type: "Repayment",
    },
    {
      customer: "Chukwumeka",
      staff: "Chikodi",
      amount: "₦56,000",
      date: "Wed, Feb 08 2023",
      time: "01:15 PM",
      type: "Repayment",
    },
  ];
  
  function RecentActivities() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
  
        <div className="flex justify-between items-center mb-5">
  
          <h2 className="text-lg font-bold">
            Recent Activities
          </h2>
  
          <button className="text-sm text-dashboard-muted hover:text-brand-blue">
            View all
          </button>
  
        </div>
  
        <div className="overflow-x-auto">
  
          <table className="w-full text-sm">
  
            <thead>
              <tr className="text-left text-dashboard-muted border-b">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Staff</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Type</th>
              </tr>
            </thead>
  
            <tbody>
  
              {activities.map((activity, index) => (
  
                <tr
                  key={index}
                  className="border-b last:border-b-0"
                >
  
                  <td className="py-4 font-medium">
                    {activity.customer}
                  </td>
  
                  <td className="py-4">
                    {activity.staff}
                  </td>
  
                  <td className="py-4">
                    {activity.amount}
                  </td>
  
                  <td className="py-4">
                    {activity.date}
                  </td>
  
                  <td className="py-4">
                    {activity.time}
                  </td>
  
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        activity.type === "Disbursed"
                          ? "bg-card-red text-red-600"
                          : "bg-card-green text-green-600"
                      }`}
                    >
                      {activity.type}
                    </span>
                  </td>
  
                </tr>
  
              ))}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  }
  
  export default RecentActivities;