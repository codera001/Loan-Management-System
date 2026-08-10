import API from "./api";

export const ReportAPI = {
  getReports: () => API.get("/reports/"),

  getStats: () => API.get("/reports/stats/"),
};