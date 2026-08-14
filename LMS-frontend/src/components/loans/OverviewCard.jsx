// This component represents the colored cards at the top of your screenshot.

function OverviewCard({
    title,
    amount,
    color = "blue",
    icon,
  }) {
    const colors = {
      white: "bg-white",
      red: "bg-card-red",
    };
  
    return (
      <div
        className={`${colors[color]} rounded-2xl p-5 min-h-[140px]`}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            {icon}
          </div>
  
          <button className="text-gray-600 hover:text-gray-900">
            ⋮
          </button>
        </div>
  
        <p className="text-sm text-dashboard-muted mt-4">
          {title}
        </p>
  
        <h2 className="text-2xl font-bold text-dashboard-text">
          {amount}
        </h2>
  
      </div>
    );
  }
  
  export default OverviewCard;