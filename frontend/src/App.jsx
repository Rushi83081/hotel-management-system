import { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, Users, Hotel, Plus } from "lucide-react";
import { api } from "./api";
import "./App.css";

const emptyRoom = {
  roomNumber: "",
  roomType: "Deluxe",
  pricePerNight: "",
  status: "AVAILABLE",
};

const emptyCustomer = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

const emptyBooking = {
  customerId: "",
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
  status: "CONFIRMED",
  totalAmount: "",
};

function App() {
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [bookingForm, setBookingForm] = useState(emptyBooking);

  const loadData = async () => {
    const [roomRes, customerRes, bookingRes] = await Promise.all([
      api.get("/rooms"),
      api.get("/customers"),
      api.get("/bookings"),
    ]);

    setRooms(roomRes.data);
    setCustomers(customerRes.data);
    setBookings(bookingRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createRoom = async (event) => {
    event.preventDefault();
    await api.post("/rooms", {
      ...roomForm,
      pricePerNight: Number(roomForm.pricePerNight),
    });
    setRoomForm(emptyRoom);
    loadData();
  };

  const createCustomer = async (event) => {
    event.preventDefault();
    await api.post("/customers", customerForm);
    setCustomerForm(emptyCustomer);
    loadData();
  };

  const createBooking = async (event) => {
    event.preventDefault();
    await api.post("/bookings", {
      ...bookingForm,
      customerId: Number(bookingForm.customerId),
      roomId: Number(bookingForm.roomId),
      totalAmount: Number(bookingForm.totalAmount),
    });
    setBookingForm(emptyBooking);
    loadData();
  };

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
          <button>
            <Plus size={18} />
            New Booking
          </button>
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

        <section className="form-grid">
          <form className="panel form-panel" onSubmit={createRoom}>
            <h3>Add Room</h3>
            <input placeholder="Room number" value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} required />
            <select value={roomForm.roomType} onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}>
              <option>Deluxe</option>
              <option>Executive</option>
              <option>Suite</option>
              <option>Standard</option>
            </select>
            <input placeholder="Price per night" type="number" value={roomForm.pricePerNight} onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })} required />
            <select value={roomForm.status} onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}>
              <option>AVAILABLE</option>
              <option>OCCUPIED</option>
              <option>MAINTENANCE</option>
            </select>
            <button type="submit">Add Room</button>
          </form>

          <form className="panel form-panel" onSubmit={createCustomer}>
            <h3>Add Customer</h3>
            <input placeholder="Full name" value={customerForm.fullName} onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })} required />
            <input placeholder="Email" type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} required />
            <input placeholder="Phone" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} required />
            <input placeholder="Address" value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })} />
            <button type="submit">Add Customer</button>
          </form>

          <form className="panel form-panel" onSubmit={createBooking}>
            <h3>Create Booking</h3>
            <select value={bookingForm.customerId} onChange={(e) => setBookingForm({ ...bookingForm, customerId: e.target.value })} required>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>{customer.fullName}</option>
              ))}
            </select>
            <select value={bookingForm.roomId} onChange={(e) => setBookingForm({ ...bookingForm, roomId: e.target.value })} required>
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option value={room.id} key={room.id}>Room {room.roomNumber}</option>
              ))}
            </select>
            <input type="date" value={bookingForm.checkInDate} onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })} required />
            <input type="date" value={bookingForm.checkOutDate} onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })} required />
            <input placeholder="Total amount" type="number" value={bookingForm.totalAmount} onChange={(e) => setBookingForm({ ...bookingForm, totalAmount: e.target.value })} required />
            <button type="submit">Create Booking</button>
          </form>
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>Rooms</h3>
            {rooms.map((room) => (
              <div className="list-row" key={room.id}>
                <span>Room {room.roomNumber} - {room.roomType}</span>
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
