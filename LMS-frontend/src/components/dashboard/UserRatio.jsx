// circular percentage chart
function UserRatio() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
  
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            Active Users Ratio
          </h2>
  
          <button>
            ⋮
          </button>
        </div>
  
        <div className="flex justify-center my-6">
  
          <div className="relative w-40 h-40">
  
            <div
              className="
                w-full
                h-full
                rounded-full
                flex
                items-center
                justify-center
              "
              style={{
                background:
                  "conic-gradient(#2563EB 0% 60%, #BFD0FF 60% 100%)",
              }}
            >
  
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  60%
                </span>
              </div>
  
            </div>
  
          </div>
  
        </div>
  
        <div className="space-y-3 text-sm">
  
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-brand-blue rounded-sm"></span>
              Male
            </span>
  
            <span>6,472</span>
          </div>
  
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-200 rounded-sm"></span>
              Female
            </span>
  
            <span>4,314</span>
          </div>
  
        </div>
  
      </div>
    );
  }
  
  export default UserRatio;