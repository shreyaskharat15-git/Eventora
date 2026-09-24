import { useEffect, useMemo, useState } from "react";

const EVENTS = [
  {id:1,title:"Sunset Music Festival",category:"Music",city:"Pune",date:"12 Oct 2026",time:"7:00 PM",venue:"Mahalaxmi Lawns",price:1499,rating:4.8,image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",description:"Live music, food, lights and an unforgettable open-air evening."},
  {id:2,title:"Tech Innovators Summit",category:"Technology",city:"Mumbai",date:"18 Oct 2026",time:"10:00 AM",venue:"Jio World Convention Centre",price:899,rating:4.9,image:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85",description:"A full-day gathering for developers, founders and technology enthusiasts."},
  {id:3,title:"Comedy Night Live",category:"Comedy",city:"Pune",date:"22 Oct 2026",time:"8:00 PM",venue:"Phoenix Marketcity",price:699,rating:4.7,image:"https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1400&q=85",description:"A premium stand-up comedy evening with live performances."},
  {id:4,title:"Startup Networking Night",category:"Business",city:"Bengaluru",date:"28 Oct 2026",time:"6:30 PM",venue:"WeWork Galaxy",price:499,rating:4.6,image:"https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=85",description:"Meet founders, designers, developers and professionals."},
  {id:5,title:"Urban Football Cup",category:"Sports",city:"Pune",date:"02 Nov 2026",time:"5:00 PM",venue:"Balewadi Stadium",price:299,rating:4.5,image:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=85",description:"Competitive local football with live action and fan experiences."},
  {id:6,title:"Creative Design Workshop",category:"Workshop",city:"Mumbai",date:"08 Nov 2026",time:"11:00 AM",venue:"The Hive",price:799,rating:4.9,image:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",description:"A practical workshop covering branding, product design and creative thinking."},
  {id:7,title:"Food & Culture Festival",category:"Festival",city:"Delhi",date:"15 Nov 2026",time:"12:00 PM",venue:"NSIC Exhibition Grounds",price:399,rating:4.6,image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=85",description:"Regional food, music, culture and local experiences."},
  {id:8,title:"Photography Walk",category:"Workshop",city:"Pune",date:"20 Nov 2026",time:"6:00 AM",venue:"Koregaon Park",price:599,rating:4.8,image:"https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1400&q=85",description:"A guided city photography walk for beginners and enthusiasts."}
];

const CATEGORIES = ["All","Music","Technology","Comedy","Business","Sports","Workshop","Festival"];
const CITIES = ["All cities","Pune","Mumbai","Bengaluru","Delhi"];

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export default function App() {
  const [page,setPage] = useState("discover");
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("All");
  const [city,setCity] = useState("All cities");
  const [sort,setSort] = useState("featured");
  const [dark,setDark] = useState(() => localStorage.getItem("eventora-theme")==="dark");
  const [favorites,setFavorites] = useState(() => read("eventora-favorites",[]));
  const [bookings,setBookings] = useState(() => read("eventora-bookings",[]));
  const [selected,setSelected] = useState(null);
  const [qty,setQty] = useState(1);
  const [ticket,setTicket] = useState("General");
  const [menu,setMenu] = useState(false);
  const [confirmed,setConfirmed] = useState(false);

  useEffect(() => localStorage.setItem("eventora-favorites",JSON.stringify(favorites)),[favorites]);
  useEffect(() => localStorage.setItem("eventora-bookings",JSON.stringify(bookings)),[bookings]);
  useEffect(() => localStorage.setItem("eventora-theme",dark?"dark":"light"),[dark]);

  const visible = useMemo(() => {
    let list = EVENTS.filter(e => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q || [e.title,e.category,e.city,e.venue].join(" ").toLowerCase().includes(q);
      const matchCategory = category==="All" || e.category===category;
      const matchCity = city==="All cities" || e.city===city;
      const matchPage = page!=="saved" || favorites.includes(e.id);
      return matchSearch && matchCategory && matchCity && matchPage;
    });
    if(sort==="low") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="high") list=[...list].sort((a,b)=>b.price-a.price);
    if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
    return list;
  },[search,category,city,sort,page,favorites]);

  const ticketPrice = selected ? selected.price + (ticket==="VIP"?1000:0) : 0;
  const total = ticketPrice * qty;

  function go(next) {
    setPage(next);
    setMenu(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function toggleFavorite(id) {
    setFavorites(x => x.includes(id) ? x.filter(v=>v!==id) : [...x,id]);
  }

  function openBooking(event) {
    setSelected(event);
    setQty(1);
    setTicket("General");
    setConfirmed(false);
  }

  function closeBooking() {
    setSelected(null);
    setConfirmed(false);
  }

  function confirmBooking() {
    const booking = {
      id:"EVT-"+Math.random().toString(36).slice(2,8).toUpperCase(),
      eventName:selected.title,
      date:selected.date,
      time:selected.time,
      venue:selected.venue,
      city:selected.city,
      ticket,
      quantity:qty,
      total,
      status:"Confirmed"
    };
    setBookings(x=>[booking,...x]);
    setConfirmed(true);
  }

  function cancelBooking(id) {
    if(window.confirm("Cancel this booking?")) {
      setBookings(x=>x.filter(b=>b.id!==id));
    }
  }

  return (
    <div className={dark?"app dark":"app"}>
      <style>{`
        *{box-sizing:border-box} html{scroll-behavior:smooth}
        body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f5f7}
        button,input,select{font:inherit} button{cursor:pointer}
        .app{--bg:#f4f5f7;--surface:#fff;--text:#161a22;--muted:#748091;--border:#e4e7ec;--accent:#5b4bdb;--soft:#efedff;min-height:100vh;background:var(--bg);color:var(--text)}
        .app.dark{--bg:#0e1117;--surface:#171b23;--text:#f2f4f7;--muted:#9ba3b2;--border:#2b313b;--accent:#8476ee;--soft:#292443}
        .container{width:min(1180px,calc(100% - 32px));margin:auto}
        .header{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--surface) 92%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
        .nav{min-height:70px;display:flex;align-items:center;justify-content:space-between;gap:18px}
        .logo{border:0;background:none;color:var(--text);font-size:22px;font-weight:800}.logo span{color:var(--accent)}
        .navlinks{display:flex;gap:24px}.navlinks button,.mobile button{border:0;background:none;color:var(--muted);font-size:13px}.navlinks .active{color:var(--text)}
        .actions{display:flex;gap:8px}.btn{height:38px;padding:0 12px;border:1px solid var(--border);border-radius:9px;background:var(--surface);color:var(--text);font-size:11px;font-weight:800}.primary{background:var(--text);color:var(--bg);border-color:var(--text)}.menu{display:none}
        .mobile{display:none;padding-bottom:14px;border-top:1px solid var(--border);padding-top:10px}
        .hero{padding:68px 0 52px}.heroGrid{display:grid;grid-template-columns:1fr 420px;gap:60px;align-items:center}
        .eyebrow{color:var(--accent);font-size:10px;font-weight:800;letter-spacing:1.5px}.hero h1{font-size:clamp(45px,6vw,70px);line-height:.98;letter-spacing:-3.5px;margin:14px 0 18px}.hero h1 span{color:var(--accent)}
        .copy{max-width:570px;color:var(--muted);font-size:16px;line-height:1.7}.search{margin-top:23px;width:min(600px,100%);display:flex;gap:10px;align-items:center;padding:14px;border:1px solid var(--border);background:var(--surface);border-radius:10px}.search input{width:100%;border:0;outline:0;background:none;color:var(--text)}
        .heroImage{height:500px;position:relative;overflow:hidden;border-radius:18px;box-shadow:0 24px 55px rgba(0,0,0,.13)}.heroImage img{width:100%;height:100%;object-fit:cover}.heroImage:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78),transparent 62%)}.heroInfo{position:absolute;z-index:1;left:22px;right:22px;bottom:22px;color:#fff}.heroInfo h2{margin:7px 0;font-size:28px}.heroInfo p{margin:0;color:#ddd;font-size:12px}
        .valueGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:55px}.value{padding:17px;border:1px solid var(--border);border-radius:12px;background:var(--surface)}.value strong{display:block;font-size:13px;margin-bottom:5px}.value span{color:var(--muted);font-size:11px;line-height:1.5}
        .section{padding-bottom:55px}.head{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:20px}.head small{color:var(--accent);font-size:10px;font-weight:800;letter-spacing:1.4px}.head h2{margin:7px 0 0;font-size:30px;letter-spacing:-1.2px}
        .cats{display:flex;flex-wrap:wrap;gap:8px}.cat{border:1px solid var(--border);background:var(--surface);color:var(--muted);padding:9px 13px;border-radius:20px;font-size:11px}.cat.active{background:var(--text);color:var(--bg);border-color:var(--text)}
        .filters{margin-top:14px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}.filterLeft{display:flex;gap:8px;flex-wrap:wrap}select{border:1px solid var(--border);background:var(--surface);color:var(--text);padding:9px 11px;border-radius:8px;font-size:11px}
        .events{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.event{overflow:hidden;border:1px solid var(--border);border-radius:14px;background:var(--surface);transition:.2s}.event:hover{transform:translateY(-3px);box-shadow:0 15px 32px rgba(0,0,0,.08)}
        .eventImage{height:205px;position:relative}.eventImage img{width:100%;height:100%;object-fit:cover;display:block}.tag{position:absolute;top:11px;left:11px;background:rgba(17,24,39,.84);color:#fff;padding:5px 8px;border-radius:5px;font-size:9px;font-weight:800}.heart{position:absolute;top:9px;right:9px;width:35px;height:35px;border:0;border-radius:50%;background:#fff;color:#677080;font-size:17px}.heart.active{color:#e11d48}
        .eventBody{padding:16px}.meta{display:flex;justify-content:space-between;color:var(--muted);font-size:10px}.rating{background:#fff5c8;color:#765900;padding:4px 6px;border-radius:6px;font-weight:800}.eventBody h3{margin:9px 0 6px;font-size:18px}.location{margin:0;color:var(--muted);font-size:12px}.eventBottom{margin-top:16px;padding-top:14px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}.price small{display:block;color:var(--muted);font-size:9px}.price strong{font-size:19px}.book{border:0;border-radius:8px;padding:9px 12px;background:var(--accent);color:#fff;font-size:11px;font-weight:800}
        .empty{padding:48px 20px;text-align:center;border:1px solid var(--border);border-radius:14px;background:var(--surface)}.empty p{color:var(--muted);font-size:13px}
        .bookings{display:grid;gap:10px}.booking{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--surface)}.bookingId{margin:0 0 4px;color:var(--accent);font-size:10px;font-weight:800}.booking h3{margin:0 0 5px;font-size:15px}.booking p{margin:0;color:var(--muted);font-size:11px;line-height:1.6}.bookingRight{text-align:right}.bookingRight strong{display:block;font-size:17px;margin-bottom:6px}.status{display:inline-block;background:#eaf8ef;color:#16854a;padding:4px 7px;border-radius:5px;font-size:9px;font-weight:800}.cancel{display:block;margin-top:7px;padding:6px 8px;border:1px solid #e3b9be;background:none;color:#b42318;border-radius:6px;font-size:10px}
        .cta{margin:5px auto 65px;padding:32px;border-radius:16px;background:#20232b;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px}.cta h2{margin:7px 0 0;font-size:28px}.cta button{border:0;border-radius:8px;padding:11px 14px;font-weight:800}
        .footer{border-top:1px solid var(--border);background:var(--surface)}.footerRow{min-height:75px;display:flex;justify-content:space-between;align-items:center;gap:20px;color:var(--muted);font-size:10px}
        .overlay{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.62);backdrop-filter:blur(5px)}.modal{width:min(500px,100%);max-height:92vh;overflow:auto;padding:20px;position:relative;border-radius:16px;background:var(--surface);color:var(--text)}.modal>img{width:100%;height:215px;object-fit:cover;border-radius:11px}.close{position:absolute;right:11px;top:11px;width:34px;height:34px;border:0;border-radius:50%;background:#fff;color:#111;font-size:20px}.modal h2{font-size:27px;margin:12px 0}.modalText{color:var(--muted);font-size:12px;line-height:1.7}.tickets{display:grid;gap:8px;margin-top:9px}.ticket{display:flex;justify-content:space-between;padding:11px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)}.ticket.selected{border-color:var(--accent);background:var(--soft)}.quantity{display:flex;justify-content:space-between;align-items:center;margin-top:17px}.qcontrols{display:flex;gap:10px;align-items:center}.qcontrols button{width:32px;height:32px;border:1px solid var(--border);border-radius:7px;background:var(--surface);color:var(--text)}.total{margin-top:17px;padding-top:15px;border-top:1px solid var(--border);display:flex;justify-content:space-between}.total strong{font-size:21px}.confirm{width:100%;margin-top:17px;padding:13px;border:0;border-radius:8px;background:var(--accent);color:#fff;font-weight:800}.success{text-align:center;padding:25px 5px}.successIcon{width:45px;height:45px;margin:auto;display:grid;place-items:center;border-radius:50%;background:#16a36a;color:#fff;font-weight:800}
        @media(max-width:950px){.navlinks{display:none}.menu{display:grid;place-items:center}.mobile{display:grid;gap:5px}.heroGrid{grid-template-columns:1fr}.events{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:620px){.container{width:calc(100% - 22px)}.nav-btn.primary{display:none}.hero{padding:40px 0 45px}.hero h1{font-size:43px;letter-spacing:-2px}.heroImage{height:360px}.valueGrid{grid-template-columns:1fr}.events{grid-template-columns:1fr}.head{align-items:flex-start;flex-direction:column}.booking{align-items:flex-start;flex-direction:column}.bookingRight{width:100%;text-align:left}.cta{align-items:flex-start;flex-direction:column;padding:25px}.footerRow{align-items:flex-start;flex-direction:column;padding:20px 0}}
      `}</style>

      <header className="header">
        <div className="container nav">
          <button className="logo" onClick={() => go("discover")}><span>✦</span> Eventora</button>

          <nav className="navlinks">
            <button className={page==="discover"?"active":""} onClick={() => go("discover")}>Discover</button>
            <button className={page==="saved"?"active":""} onClick={() => go("saved")}>Saved</button>
            <button className={page==="bookings"?"active":""} onClick={() => go("bookings")}>My Bookings</button>
          </nav>

          <div className="actions">
            <button className="btn" onClick={() => setDark(v=>!v)}>{dark?"☀":"◐"}</button>
            <button className="btn" onClick={() => go("bookings")}>Bookings {bookings.length ? "(" + bookings.length + ")" : ""}</button>
            <button className="btn primary" onClick={() => go("discover")}>Explore</button>
            <button className="btn menu" onClick={() => setMenu(v=>!v)}>☰</button>
          </div>
        </div>

        {menu && (
          <div className="container mobile">
            <button onClick={() => go("discover")}>Discover</button>
            <button onClick={() => go("saved")}>Saved</button>
            <button onClick={() => go("bookings")}>My Bookings</button>
          </div>
        )}
      </header>

      {page==="discover" && (
        <>
          <section className="hero">
            <div className="container heroGrid">
              <div>
                <div className="eyebrow">EVENT DISCOVERY & BOOKING</div>
                <h1>Find something<br /><span>worth going to.</span></h1>
                <p className="copy">Discover concerts, technology events, sports, workshops and experiences happening around you.</p>

                <div className="search">
                  <span>⌕</span>
                  <input
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                    placeholder="Search events, cities or venues..."
                  />
                </div>
              </div>

              <div className="heroImage">
                <img src={EVENTS[0].image} alt={EVENTS[0].title} />
                <div className="heroInfo">
                  <div className="eyebrow">FEATURED EVENT</div>
                  <h2>{EVENTS[0].title}</h2>
                  <p>{EVENTS[0].date} · {EVENTS[0].city}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="container">
            <div className="valueGrid">
              <div className="value"><strong>Instant confirmation</strong><span>Bookings are saved immediately on this device.</span></div>
              <div className="value"><strong>Curated experiences</strong><span>Music, technology, sports, workshops and more.</span></div>
              <div className="value"><strong>Responsive everywhere</strong><span>Optimized for phone, tablet and laptop browsers.</span></div>
            </div>
          </section>

          <section className="container section">
            <div className="head">
              <div><small>CATEGORIES</small><h2>Browse events</h2></div>
              <span className="count">{visible.length} events</span>
            </div>

            <div className="cats">
              {CATEGORIES.map(c=>(
                <button
                  key={c}
                  className={category===c?"cat active":"cat"}
                  onClick={()=>setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="filters">
              <div className="filterLeft">
                <select value={city} onChange={e=>setCity(e.target.value)}>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>

                <select value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="rating">Highest rated</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
              </div>
            </div>
          </section>

          <section className="container section">
            <div className="head">
              <div><small>UPCOMING</small><h2>Popular events</h2></div>
            </div>

            {visible.length===0 ? (
              <div className="empty">
                <h3>No matching events</h3>
                <p>Try another search, city or category.</p>
              </div>
            ) : (
              <div className="events">
                {visible.map(event=>(
                  <article className="event" key={event.id}>
                    <div className="eventImage">
                      <img src={event.image} alt={event.title} />
                      <span className="tag">{event.category}</span>
                      <button
                        className={favorites.includes(event.id)?"heart active":"heart"}
                        onClick={()=>toggleFavorite(event.id)}
                      >
                        {favorites.includes(event.id)?"♥":"♡"}
                      </button>
                    </div>

                    <div className="eventBody">
                      <div className="meta">
                        <span>{event.date} · {event.time}</span>
                        <span className="rating">★ {event.rating}</span>
                      </div>

                      <h3>{event.title}</h3>
                      <p className="location">📍 {event.venue}, {event.city}</p>

                      <div className="eventBottom">
                        <div className="price">
                          <small>Starting from</small>
                          <strong>₹{event.price}</strong>
                        </div>

                        <button className="book" onClick={()=>openBooking(event)}>
                          View & Book
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="container cta">
            <div>
              <div className="eyebrow">EVENTORA</div>
              <h2>Discover experiences worth remembering.</h2>
            </div>
            <button onClick={()=>window.scrollTo({top:600,behavior:"smooth"})}>Explore events →</button>
          </section>
        </>
      )}

      {page==="saved" && (
        <section className="container section">
          <div className="head">
            <div><small>SAVED EVENTS</small><h2>Your favorites</h2></div>
            <span className="count">{favorites.length} saved</span>
          </div>

          {visible.length===0 ? (
            <div className="empty">
              <h3>No saved events</h3>
              <p>Tap the heart on an event to save it here.</p>
              <button className="book" onClick={()=>go("discover")}>Discover events</button>
            </div>
          ) : (
            <div className="events">
              {visible.map(event=>(
                <article className="event" key={event.id}>
                  <div className="eventImage">
                    <img src={event.image} alt={event.title} />
                    <button className="heart active" onClick={()=>toggleFavorite(event.id)}>♥</button>
                  </div>
                  <div className="eventBody">
                    <div className="meta"><span>{event.date}</span><span className="rating">★ {event.rating}</span></div>
                    <h3>{event.title}</h3>
                    <p className="location">📍 {event.city}</p>
                    <div className="eventBottom">
                      <div className="price"><small>From</small><strong>₹{event.price}</strong></div>
                      <button className="book" onClick={()=>openBooking(event)}>View & Book</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {page==="bookings" && (
        <section className="container section">
          <div className="head">
            <div><small>MY ACTIVITY</small><h2>Your bookings</h2></div>
            <span className="count">{bookings.length} bookings</span>
          </div>

          {bookings.length===0 ? (
            <div className="empty">
              <h3>No bookings yet</h3>
              <p>Your confirmed tickets will appear here.</p>
              <button className="book" onClick={()=>go("discover")}>Find an event</button>
            </div>
          ) : (
            <div className="bookings">
              {bookings.map(b=>(
                <div className="booking" key={b.id}>
                  <div>
                    <p className="bookingId">{b.id}</p>
                    <h3>{b.eventName}</h3>
                    <p>
                      {b.date} · {b.time}<br />
                      📍 {b.venue}, {b.city}<br />
                      {b.ticket} · {b.quantity} ticket{b.quantity!==1?"s":""}
                    </p>
                  </div>
                  <div className="bookingRight">
                    <strong>₹{b.total}</strong>
                    <span className="status">{b.status}</span>
                    <button className="cancel" onClick={()=>cancelBooking(b.id)}>Cancel booking</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        <div className="container footerRow">
          <strong><span style={{color:"var(--accent)"}}>✦</span> Eventora</strong>
          <span>Discover experiences worth remembering.</span>
          <span>© 2026 Eventora</span>
        </div>
      </footer>

      {selected && (
        <div className="overlay">
          <div className="modal">
            <button className="close" onClick={closeBooking}>×</button>
            <img src={selected.image} alt={selected.title} />

            {!confirmed ? (
              <>
                <div className="eyebrow" style={{marginTop:18}}>{selected.category}</div>
                <h2>{selected.title}</h2>

                <div className="modalText">
                  <div>📅 {selected.date} · {selected.time}</div>
                  <div>📍 {selected.venue}, {selected.city}</div>
                  <p>{selected.description}</p>
                </div>

                <div style={{marginTop:18,fontSize:12,fontWeight:800}}>Choose ticket type</div>

                <div className="tickets">
                  {["General","VIP"].map(type=>(
                    <button
                      key={type}
                      className={ticket===type?"ticket selected":"ticket"}
                      onClick={()=>setTicket(type)}
                    >
                      <span>{type}</span>
                      <strong>₹{selected.price + (type==="VIP"?1000:0)}</strong>
                    </button>
                  ))}
                </div>

                <div className="quantity">
                  <span>Tickets</span>
                  <div className="qcontrols">
                    <button onClick={()=>setQty(v=>Math.max(1,v-1))}>−</button>
                    <strong>{qty}</strong>
                    <button onClick={()=>setQty(v=>v+1)}>+</button>
                  </div>
                </div>

                <div className="total">
                  <span>Total</span>
                  <strong>₹{total}</strong>
                </div>

                <button className="confirm" onClick={confirmBooking}>
                  Confirm booking
                </button>
              </>
            ) : (
              <div className="success">
                <div className="successIcon">✓</div>
                <h2>Booking confirmed</h2>
                <p style={{color:"var(--muted)",fontSize:13}}>
                  Your ticket has been saved successfully.
                </p>
                <button className="confirm" onClick={()=>{closeBooking();go("bookings")}}>
                  View my bookings
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
