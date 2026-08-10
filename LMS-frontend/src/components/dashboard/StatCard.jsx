function StatCard({ title, value }) {
    return (
      <div className="bg-dashboard-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-dashboard-muted">
            {title}
          </p>
  
          <button className="text-gray-500">
            ⋮
          </button>
        </div>
  
        <h2 className="text-3xl font-bold text-dashboard-text mt-2">
          {value}
        </h2>
      </div>
    );
  }
  
  export default StatCard;