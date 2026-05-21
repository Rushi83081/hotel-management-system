import { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, Users, Hotel } from "lucide-react";
import { api } from "./api";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/rooms").then((res) => setRooms(res.data));
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/bookings").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Hotel size={28} />
          <span>HotelOps</span>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Rooms</a>
          <a>Bookings</a>
          <a>Customers</a>
          <a>Reports</a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hotel Management System</p>
            <h1>Operations Dashboard</h1>
          </div>
          <button>New Booking</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <BedDouble />
            <div>
              <p>Total Rooms</p>
              <h2>{rooms.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <Users />
            <div>
              <p>Customers</p>
              <h2>{customers.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <CalendarCheck />
            <div>
              <p>Bookings</p>
              <h2>{bookings.length}</h2>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>Rooms</h3>
            {rooms.map((room) => (
              <div className="list-row" key={room.id}>
                <span>Room {room.roomNumber}</span>
                <strong>{room.status}</strong>
              </div>
            ))}
          </div>

          <div className="panel">
            <h3>Recent Bookings</h3>
            {bookings.map((booking) => (
              <div className="list-row" key={booking.id}>
                <span>Booking #{booking.id}</span>
                <strong>{booking.status}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
