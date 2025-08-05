import Sidebar from "../../components/sidebar/Sidebar";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Selamat Datang di Dashboard</h1>
        <p>Ini adalah ringkasan aktivitas Anda.</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Produk</h3>
            <p>120</p>
          </div>
          <div className="dashboard-card">
            <h3>Penjualan Bulan Ini</h3>
            <p>Rp 15.000.000</p>
          </div>
          <div className="dashboard-card">
            <h3>Stok Menipis</h3>
            <p>8 Produk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
