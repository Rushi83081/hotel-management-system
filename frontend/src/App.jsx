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
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const createBooking = async (event) => {
  event.preventDefault();

  await api.post("/bookings", {
    customer: {
      id: Number(bookingForm.customerId),
    },

    room: {
      id: Number(bookingForm.roomId),
    },

    checkInDate: bookingForm.checkInDate,
    checkOutDate: bookingForm.checkOutDate,
    status: bookingForm.status,
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
          <a>Bookings</a>
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
          <form className="panel form-panel" onSubmit={createBooking}>
            <h3>New Booking</h3>

            <select
              value={bookingForm.customerId}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  customerId: e.target.value,
                })
              }
              required
            >
              <option value="">Select customer</option>

              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>
                  {customer.fullName}
                </option>
              ))}
            </select>

            <select
              value={bookingForm.roomId}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  roomId: e.target.value,
                })
              }
              required
            >
              <option value="">Select room</option>

              {rooms.map((room) => (
                <option value={room.id} key={room.id}>
                  Room {room.roomNumber} - {room.roomType}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={bookingForm.checkInDate}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  checkInDate: e.target.value,
                })
              }
              required
            />

            <input
              type="date"
              value={bookingForm.checkOutDate}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  checkOutDate: e.target.value,
                })
              }
              required
            />

            <input
              placeholder="Total amount"
              type="number"
              value={bookingForm.totalAmount}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  totalAmount: e.target.value,
                })
              }
              required
            />

            <button type="submit">Book Room</button>
          </form>
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>Rooms</h3>

            {rooms.map((room) => (
              <div className="list-row" key={room.id}>
                <span>
                  Room {room.roomNumber} - {room.roomType}
                </span>

                <strong>{room.status}</strong>
              </div>
            ))}
          </div>

         <div className="panel">
  <h3>Bookings</h3>

  <table className="booking-table">
    <thead>
      <tr>
        <th>Room</th>
        <th>Customer</th>
        <th>Check-In</th>
        <th>Check-Out</th>
        <th>Status</th>
        <th>Details</th>
      </tr>
    </thead>

    <tbody>
      {bookings.map((booking) => (
        <tr key={booking.id}>
          <td>{booking.room?.roomNumber}</td>

          <td>{booking.customer?.fullName}</td>

          <td>{booking.checkInDate}</td>

          <td>{booking.checkOutDate}</td>

          <td>{booking.status}</td>

          <td>
            <button onClick={() => setSelectedBooking(booking)}>
              Details
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</section>

{selectedBooking && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>Booking Details</h2>

      <p>
        <strong>Room Number:</strong>{" "}
        {selectedBooking.room?.roomNumber}
      </p>

      <p>
        <strong>Room Type:</strong>{" "}
        {selectedBooking.room?.roomType}
      </p>

      <p>
        <strong>Price:</strong>{" "}
        ₹{selectedBooking.room?.pricePerNight}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {selectedBooking.room?.status}
      </p>

      <hr />

      <p>
        <strong>Customer:</strong>{" "}
        {selectedBooking.customer?.fullName}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {selectedBooking.customer?.email}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {selectedBooking.customer?.phone}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {selectedBooking.customer?.address}
      </p>

      <hr />

      <p>
        <strong>Check-In:</strong>{" "}
        {selectedBooking.checkInDate}
      </p>

      <p>
        <strong>Check-Out:</strong>{" "}
        {selectedBooking.checkOutDate}
      </p>

      <p>
        <strong>Total Amount:</strong>{" "}
        ₹{selectedBooking.totalAmount}
      </p>

      <button onClick={() => setSelectedBooking(null)}>
        Close
      </button>

    </div>
  </div>
)}

      </main>
    </div>
  );
}

export default App;
