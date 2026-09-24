import { useState } from "react";

const events = [
  { title: "Sunset Music Festival", category: "Music", price: 1499, location: "Pune", date: "12 Oct 2026", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80" },
  { title: "Tech Innovators Summit", category: "Technology", price: 899, location: "Mumbai", date: "18 Oct 2026", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80" },
  { title: "Comedy Night Live", category: "Comedy", price: 699, location: "Pune", date: "22 Oct 2026", image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80" },
  { title: "Startup Networking", category: "Business", price: 499, location: "Bengaluru", date: "28 Oct 2026", image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1000&q=80" }
];

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const filtered = events.filter((e) => {
    const text = search.toLowerCase();
    return (
      (category === "All" || e.category === category) &&
      (e.title.toLowerCase().includes(text) ||
       e.location.toLowerCase().includes(text))
    );
  });

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh", color: "#111", fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "20px 6%", background: "#fff", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Eventora</h2>
        <nav style={{ display: "flex", gap: 25 }}>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#categories">Categories</a>
        </nav>
        <button style={{ background: "#111", color: "#fff", border: 0, padding: "10px 16px", borderRadius: 8 }}>Explore</button>
      </header>

      <section id="home" style={{ padding: "80px 6%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }}>
        <div>
          <p style={{ color: "#6c5ce7", fontWeight: 700, letterSpacing: 1 }}>EVENT DISCOVERY</p>
          <h1 style={{ fontSize: "clamp(45px, 6vw, 72px)", lineHeight: 1, margin: "15px 0" }}>
            Find something<br />
            <span style={{ color: "#6c5ce7" }}>worth going to.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#666" }}>
            Discover concerts, workshops, sports and experiences happening around you.
          </p>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events or locations..."
            style={{ width: "90%", padding: 16, border: "1px solid #ddd", borderRadius: 10, marginTop: 20, fontSize: 15 }}
          />
        </div>

        <img
          src={events[0].image}
          alt={events[0].title}
          style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 20 }}
        />
      </section>

      <section id="categories" style={{ padding: "30px 6%" }}>
        <p style={{ color: "#6c5ce7", fontWeight: 700 }}>CATEGORIES</p>
        <h2>Browse events</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["All", "Music", "Technology", "Comedy", "Business"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "10px 16px",
                borderRadius: 20,
                border: "1px solid #ddd",
                background: category === c ? "#111" : "#fff",
                color: category === c ? "#fff" : "#555"
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section id="events" style={{ padding: "50px 6% 90px" }}>
        <h2>Popular events</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {filtered.map((event) => (
            <div key={event.title} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e5e5" }}>
              <img src={event.image} alt={event.title} style={{ width: "100%", height: 210, objectFit: "cover" }} />

              <div style={{ padding: 18 }}>
                <small style={{ color: "#777" }}>{event.category} · {event.date}</small>
                <h3>{event.title}</h3>
                <p style={{ color: "#666" }}>📍 {event.location}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                  <strong>₹{event.price}</strong>

                  <button
                    onClick={() => { setSelected(event); setQuantity(1); }}
                    style={{ background: "#6c5ce7", color: "#fff", border: 0, padding: "10px 15px", borderRadius: 8 }}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: 30, background: "#111", color: "#aaa", textAlign: "center" }}>
        Eventora · Discover experiences worth remembering.
      </footer>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ background: "#fff", padding: 25, borderRadius: 16, width: "min(450px,100%)" }}>
            <button onClick={() => setSelected(null)} style={{ float: "right", border: 0, background: "none", fontSize: 22 }}>×</button>

            <img src={selected.image} alt={selected.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }} />

            <h2>{selected.title}</h2>
            <p>{selected.date} · {selected.location}</p>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "25px 0" }}>
              <span>Tickets</span>
              <div>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <strong style={{ margin: "0 15px" }}>{quantity}</strong>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <h3>Total: ₹{selected.price * quantity}</h3>

            <button
              onClick={() => {
                const bookings = JSON.parse(localStorage.getItem("eventora-bookings") || "[]");
                bookings.push({
                  event: selected.title,
                  date: selected.date,
                  quantity,
                  total: selected.price * quantity
                });
                localStorage.setItem("eventora-bookings", JSON.stringify(bookings));
                alert("Booking confirmed!");
                setSelected(null);
              }}
              style={{ width: "100%", padding: 14, border: 0, borderRadius: 8, background: "#6c5ce7", color: "#fff", fontWeight: 700 }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
