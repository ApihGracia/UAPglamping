console.log("ADMIN JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/UAPglamping/api/dashboardadmin.php")
    .then(res => {
      if (!res.ok) {
        throw new Error("HTTP ERROR " + res.status);
      }
      return res.json();
    })
    .then(data => {
      console.log("DATA MASUK:", data);

      document.getElementById("totalCustomers").textContent  = data.total_customers ?? 0;
      document.getElementById("totalBookings").textContent   = data.total_bookings ?? 0;
      document.getElementById("totalActivities").textContent = data.total_activities ?? 0;
      document.getElementById("totalPackages").textContent   = data.total_packages ?? 0;
    })
    .catch(err => {
      console.error("Dashboard fetch error:", err);
    });
});
