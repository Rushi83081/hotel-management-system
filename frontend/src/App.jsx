import { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, Users, Hotel, EyeOff } from "lucide-react";
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
  // Navigation State: 'dashboard' or 'bookings'
  const [currentView, setCurrentView] = useState("dashboard");

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [bookingForm, setBookingForm] = useState(emptyBooking);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Load Data and Run Auto-Checkout Check
  const loadData = async () => {
    try {
      const [roomRes, customerRes, bookingRes] = await Promise.all([
        api.get("/rooms"),
        api.get("/customers"),
        api.get("/bookings"),
      ]);
      
      setRooms(roomRes.data);
      setCustomers(customerRes.data);
      setBookings(bookingRes.data);

      // Trigger automatic calendar checkout calculations
      checkAutomaticCheckouts(bookingRes.data);
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  };

  // Smart Auto-Checkout Rule Engine
  const checkAutomaticCheckouts = async (allBookings) => {
    const today = new Date();
    // Normalize today's date to midnight for accurate date-only comparisons
    today.setHours(0, 0, 0, 0);

    for (const booking of allBookings) {
      if (booking.status === "CONFIRMED" && booking.checkOutDate) {
        const checkoutDate = new Date(booking.checkOutDate);
        checkoutDate.setHours(0, 0, 0, 0);

        // If checkout date is today or has already passed, run auto-checkout
        if (checkoutDate <= today) {
          try {
            await api.put(`/bookings/${booking.id}/checkout`);
            alert(`📢 Auto-Checkout Notification: Room ${booking.room?.roomNumber || ""} has reached its checkout date and is now AVAILABLE!`);
            // Reload data after updating values
            const [roomRes, bookingRes] = await Promise.all([
              api.get("/rooms"),
              api.get("/bookings")
            ]);
            setRooms(roomRes.data);
            setBookings(bookingRes.data);
          } catch (err) {
            console.error("Auto-checkout failed for booking ID:", booking.id, err);
          }
        }
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const selectedRoom = rooms.find(
      (room) => room.id === Number(bookingForm.roomId)
    );

    if (selectedRoom && bookingForm.checkInDate && bookingForm.checkOutDate) {
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);
      const totalDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
      const total = totalDays * selectedRoom.pricePerNight;

      setBookingForm((prev) => ({
        ...prev,
        totalAmount: total > 0 ? total : 0,
      }));
    }
  }, [bookingForm.roomId, bookingForm.checkInDate, bookingForm.checkOutDate, rooms]);

  // Form Handlers
  const createRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", {
        roomNumber: roomForm.roomNumber,
        roomType: roomForm.roomType,
        pricePerNight: Number(roomForm.pricePerNight),
        status: roomForm.status,
      });
      setRoomForm(emptyRoom);
      loadData();
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const createCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post("/customers", customerForm);
      setCustomerForm(emptyCustomer);
      loadData();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bookings", {
        customer: { id: Number(bookingForm.customerId) },
        room: { id: Number(bookingForm.roomId) },
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        status: bookingForm.status,
        totalAmount: Number(bookingForm.totalAmount),
      });
      setBookingForm(emptyBooking);
      loadData();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    await api.delete(`/bookings/${bookingId}`);
    loadData();
  };

  const checkoutBooking = async (bookingId) => {
    await api.put(`/bookings/${bookingId}/checkout`);
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
          <a 
            className={currentView === "dashboard" ? "active" : ""} 
            onClick={() => setCurrentView("dashboard")}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </a>
          <a 
            className={currentView === "bookings" ? "active" : ""} 
            onClick={() => setCurrentView("bookings")}
            style={{ cursor: "pointer" }}
          >
            Bookings
          </a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hotel Management System</p>
            <h1>{currentView === "dashboard" ? "Operations Dashboard" : "Master Bookings Log"}</h1>
          </div>
        </header>

        {/* Stats Summary Cards */}
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

        {/* --- VIEW 1: DASHBOARD VIEW --- */}
        {currentView === "dashboard" && (
          <>
            <section className="operations-management-grid">
              {/* Section 1: Add New Room */}
              <form className="panel form-panel" onSubmit={createRoom}>
                <h3>1. Add New Room</h3>
                <input
                  type="text"
                  placeholder="Room Number (e.g. 101)"
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  required
                />
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                  required
                >
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Standard">Standard</option>
                </select>
                <input
                  type="number"
                  placeholder="Price Per Night (₹)"
                  value={roomForm.pricePerNight}
                  onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                  required
                />
                <button type="submit" className="btn-success">Add Room</button>
              </form>

              {/* Section 2: Add New Customer */}
              <form className="panel form-panel" onSubmit={createCustomer}>
                <h3>2. Register Customer</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerForm.fullName}
                  onChange={(e) => setCustomerForm({ ...customerForm, fullName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="City Address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  required
                />
                <button type="submit" className="btn-success">Register Guest</button>
              </form>

              {/* Section 3: Assign Room */}
              <form className="panel form-panel" onSubmit={createBooking}>
                <h3>3. Assign Room to Customer</h3>
                <select
                  value={bookingForm.customerId}
                  onChange={(e) => setBookingForm({ ...bookingForm, customerId: e.target.value })}
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
                  onChange={(e) => setBookingForm({ ...bookingForm, roomId: e.target.value })}
                  required
                >
                  <option value="">Select room</option>
                  {rooms
                    .filter((room) => room.status === "AVAILABLE")
                    .map((room) => (
                      <option value={room.id} key={room.id}>
                        Room {room.roomNumber} - {room.roomType}
                      </option>
                    ))}
                </select>

                <input
                  type="date"
                  value={bookingForm.checkInDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                  required
                />

                <input
                  type="date"
                  value={bookingForm.checkOutDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                  required
                />

                <input
                  placeholder="Calculated Total Amount"
                  type="number"
                  value={bookingForm.totalAmount}
                  readOnly
                />

                <button type="submit">Book Room</button>
              </form>
            </section>

            {/* Room Live Status Panel stays on Dashboard */}
            <section style={{ marginTop: "20px" }}>
              <div className="panel">
                <h3>Current Rooms Availability</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
                  {rooms.map((room) => (
                    <div className={`room-card-status ${room.status.toLowerCase()}`} key={room.id} style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ddd", background: room.status === "AVAILABLE" ? "#e6f4ea" : "#fce8e6" }}>
                      <strong>Room {room.roomNumber}</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#555" }}>{room.roomType}</p>
                      <span className={`status-badge ${room.status.toLowerCase()}`} style={{ fontWeight: "bold", color: room.status === "AVAILABLE" ? "#137333" : "#c5221f" }}>
                        {room.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- VIEW 2: BOOKINGS VIEW --- */}
        {currentView === "bookings" && (
          <section className="full-width-panel">
            <div className="panel">
              <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "15px" }}>
                <h3>Bookings Archive Log</h3>
              </div>
              
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Customer</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Checkout</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.room?.roomNumber}</td>
                      <td>{booking.customer?.fullName}</td>
                      <td>{booking.checkInDate}</td>
                      <td>{booking.checkOutDate}</td>
                      <td>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td><button onClick={() => setSelectedBooking(booking)}>Details</button></td>
                      <td>
                        {booking.status !== "COMPLETED" ? (
                          <button onClick={() => checkoutBooking(booking.id)}>Checkout</button>
                        ) : (
                          <span>Completed</span>
                        )}
                      </td>
                      <td><button onClick={() => deleteBooking(booking.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Details Modal with the new "Hide" / Close implementation */}
        {selectedBooking && (
          <div className="modal-overlay">
            <div className="modal">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h2>Booking Details</h2>
                <button 
                  onClick={() => setSelectedBooking(null)} 
                  style={{ display: "flex", alignItems: "center", gap: "5px", background: "#6c757d", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                >
                  <EyeOff size={16} /> Hide
                </button>
              </div>
              <p><strong>Room Number:</strong> {selectedBooking.room?.roomNumber}</p>
              <p><strong>Room Type:</strong> {selectedBooking.room?.roomType}</p>
              <p><strong>Price:</strong> ₹{selectedBooking.room?.pricePerNight}</p>
              <p><strong>Status:</strong> {selectedBooking.room?.status}</p>
              <hr />
              <p><strong>Customer:</strong> {selectedBooking.customer?.fullName}</p>
              <p><strong>Email:</strong> {selectedBooking.customer?.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.customer?.phone}</p>
              <p><strong>Address:</strong> {selectedBooking.customer?.address}</p>
              <hr />
              <p><strong>Check-In:</strong> {selectedBooking.checkInDate}</p>
              <p><strong>Check-Out:</strong> {selectedBooking.checkOutDate}</p>
              <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}</p>
              <button onClick={() => setSelectedBooking(null)} style={{ marginTop: "15px", width: "100%" }}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
