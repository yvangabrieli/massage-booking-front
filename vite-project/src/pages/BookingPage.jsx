import { useState, useEffect, useRef } from "react";
import { createBooking } from "../services/bookingService";
import { getServices } from "../services/serviceService";
import MyBookings from "../components/booking/MyBookings";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WORKING = [4,5,6,0];

function isWorking(date){ return WORKING.includes(date.getDay()); }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

const navBtnStyle = {
  background:"none",
  border:"none",
  fontSize:"1.5rem",
  cursor:"pointer",
  color:"#6b4226",
  padding:"0 8px"
};

const Calendar = ({ selectedDate, onSelect }) => {
  const today = new Date();
  const [view, setView] = useState({year: today.getFullYear(), month: today.getMonth()});
  const prevMonth = () => setView(v => { const d = new Date(v.year, v.month-1, 1); return {year:d.getFullYear(), month:d.getMonth()}; });
  const nextMonth = () => setView(v => { const d = new Date(v.year, v.month+1, 1); return {year:d.getFullYear(), month:d.getMonth()}; });
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month+1, 0).getDate();
  const cells = [];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(new Date(view.year, view.month, d));
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate()+90);

  return (
    <div style={{
      background:"#f8f5f0",
      borderRadius:"18px",
      padding:"1.5rem",
      boxShadow:"0 10px 25px rgba(0,0,0,0.12)"
    }}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:"1rem", fontWeight:600, color:"#5a3820"}}>
        <button onClick={prevMonth} style={navBtnStyle}>‹</button>
        <span>{MONTHS[view.month]} {view.year}</span>
        <button onClick={nextMonth} style={navBtnStyle}>›</button>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"6px"}}>
        {cells.map((date,i)=>{
          if(!date) return <div key={i}/>;
          const isPast=date<new Date(today.getFullYear(),today.getMonth(),today.getDate());
          const isFuture=date>maxDate;
          const isAvail=isWorking(date)&&!isPast&&!isFuture;
          const isSelected=selectedDate&&sameDay(date,selectedDate);
          return (
            <button key={date.toISOString()}
              onClick={()=>isAvail&&onSelect(date)}
              style={{
                padding:"12px",
                borderRadius:"12px",
                cursor:isAvail?"pointer":"default",
                border:isSelected?"2px solid #a87c5f":"1px solid #d2c6b6",
                background:isSelected?"#a87c5f":isAvail?"#fffaf5":"#e8e2da",
                color:isSelected?"white":isAvail?"#5a3820":"#aaa",
                fontWeight:600,
                transition:"all 0.2s"
              }}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const TimeSlotPicker = ({ date, selectedTime, onSelect }) => {
  const [slots, setSlots] = useState([]);
  useEffect(()=>{
    if(!date) return;
    const pad=n=>String(n).padStart(2,"0");
    const dateStr=`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
    api.get(`/availability/slots?date=${dateStr}`)
      .then(res=>setSlots(res.data||[]))
      .catch(()=>setSlots([]));
  },[date]);

  if(!date) return null;
  if(slots.length===0) return <div style={{color:"#999"}}>No slots available</div>;

  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginTop:"1rem"}}>
      {slots.map(slot=>{
        const time=typeof slot==="string"?slot.slice(11,16):"";
        const isSelected=selectedTime===time;
        return (
          <button key={slot}
            onClick={()=>onSelect(time)}
            style={{
              padding:"10px 0",
              borderRadius:"14px",
              border:`2px solid ${isSelected?"#a87c5f":"#d2c6b6"}`,
              background:isSelected?"#a87c5f":"#fffaf5",
              color:isSelected?"white":"#5a3820",
              fontWeight:600,
              transition:"all 0.2s",
              cursor:"pointer",
              fontSize:"0.95rem"
            }}>
            {time}
          </button>
        )
      })}
    </div>
  )
}

const BookingPage = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [services,setServices] = useState([]);
  const [selectedService,setSelectedService] = useState(null);
  const [selectedDate,setSelectedDate] = useState(null);
  const [selectedTime,setSelectedTime] = useState(null);
  const [success,setSuccess] = useState("");
  const [error,setError] = useState("");
  const [showLoginModal,setShowLoginModal] = useState(false);
  const [refreshKey,setRefreshKey] = useState(0);

  const calendarRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(()=>{ getServices().then(res=>setServices(res.data||[])); },[]);

  useEffect(()=>{ if(selectedService && calendarRef.current){ calendarRef.current.scrollIntoView({behavior:"smooth"}); } },[selectedService]);
  useEffect(()=>{ if(selectedDate && timeRef.current){ timeRef.current.scrollIntoView({behavior:"smooth"}); } },[selectedDate]);

  const handleBook=async()=>{
    if(!user){ setShowLoginModal(true); return; }
    if(!selectedService||!selectedDate||!selectedTime){ setError("Please complete all steps."); return; }
    const pad=n=>String(n).padStart(2,"0");
    const startTime=`${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())}T${selectedTime}:00`;
    try{
      await createBooking({serviceId:selectedService.id,startTime});
      setSuccess("Booking confirmed");
      setSelectedService(null); setSelectedDate(null); setSelectedTime(null);
      setRefreshKey(k=>k+1);
    }catch{
      setError("Could not create booking.");
    }
  };

  const CATEGORIES={
    DEEP_TISSUE:"Deep Tissue",
    RELAXING:"Relaxation",
    SPECIALIZED:"Specialised"
  };

  return (
    <div style={{
      backgroundImage:`url("/imagines/afropattern.png")`,
      backgroundSize:"cover",
      backgroundPosition:"center",
      minHeight:"100vh",
      padding:"80px 0",
      fontFamily:"'Poppins', sans-serif"
    }}>
      <div style={{
        background:"rgba(248,245,240,0.95)",
        maxWidth:"1200px",
        margin:"auto",
        borderRadius:"28px",
        padding:"50px",
        boxShadow:"0 12px 45px rgba(0,0,0,0.15)"
      }}>

        <h2 style={{fontWeight:700,color:"#5a3820",marginBottom:"2rem", fontSize:"2rem"}}>Book Your Session</h2>

        <div style={{marginBottom:"2rem", fontSize:"1rem", color:"#7d5c3b", fontWeight:500}}>
          1. Service {selectedService && "✓"} → 2. Date {selectedDate && "✓"} → 3. Time {selectedTime && "✓"} → 4. Confirm
        </div>

        {/* SERVICES GRID */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"22px"}}>
          {services.map(s=>(
            <div key={s.id} onClick={()=>setSelectedService(s)}
              style={{
                padding:"1.8rem",
                borderRadius:"22px",
                background:"#fffaf5",
                cursor:"pointer",
                border:`2px solid ${selectedService?.id===s.id?"#a87c5f":"transparent"}`,
                boxShadow:"0 14px 32px rgba(0,0,0,0.08)",
                transition:"all 0.3s"
              }}>
              <strong style={{fontSize:"1.15rem", color:"#4b2e1e"}}>{s.name}</strong>
              <div style={{fontSize:"0.88rem",color:"#7d5c3b",marginTop:"6px"}}>{CATEGORIES[s.category]}</div>
              <div style={{fontSize:"0.9rem",marginTop:"6px",color:"#5a3820"}}>{s.description?.slice(0,70)}...</div>
              <div style={{marginTop:"12px",fontWeight:600, color:"#4b2e1e"}}>{s.durationMinutes} min · {s.price}€</div>
            </div>
          ))}
        </div>

        {/* CALENDAR + TIME */}
        {selectedService && (
          <div style={{display:"flex", flexWrap:"wrap", gap:"2rem", marginTop:"3rem"}}>
            <div style={{flex:"1 1 320px"}} ref={calendarRef}><Calendar selectedDate={selectedDate} onSelect={(d)=>{setSelectedDate(d);setSelectedTime(null);}}/></div>
            <div style={{flex:"1 1 200px"}} ref={timeRef}><TimeSlotPicker date={selectedDate} selectedTime={selectedTime} onSelect={setSelectedTime}/></div>
          </div>
        )}

        {/* CONFIRM BUTTON */}
        {selectedService && selectedDate && selectedTime && (
          <div style={{
            marginTop:"3rem",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"1.6rem 2rem",
            background:"#f5efe8",
            borderRadius:"18px",
            fontWeight:600
          }}>
            <div style={{color:"#5a3820"}}>{selectedService.name} — {selectedTime}</div>
            <button onClick={handleBook} style={{
              background:"#a87c5f",
              color:"white",
              border:"none",
              padding:"14px 36px",
              borderRadius:"35px",
              fontWeight:700,
              fontSize:"1rem",
              cursor:"pointer",
              transition:"all 0.2s",
              boxShadow:"0 6px 18px rgba(168,124,95,0.5)"
            }}>Confirm Booking</button>
          </div>
        )}

        {/* MY BOOKINGS */}
        {user && (
          <>
            <hr style={{margin:"3rem 0"}}/>
            <h4 style={{color:"#5a3820"}}>My Bookings</h4>
            <MyBookings key={refreshKey}/>
          </>
        )}

      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{
          position:"fixed",
          top:0,left:0,right:0,bottom:0,
          background:"rgba(0,0,0,0.55)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          zIndex:999
        }}>
          <div style={{
            background:"#fffaf5",
            padding:"2rem",
            borderRadius:"22px",
            textAlign:"center",
            width:"360px",
            boxShadow:"0 14px 36px rgba(0,0,0,0.25)"
          }}>
            <h5 style={{marginBottom:"1rem", fontWeight:700, color:"#5a3820"}}>Almost there</h5>
            <p style={{marginBottom:"1.5rem", color:"#7d5c3b"}}>Please login or register to complete booking.</p>
            <div style={{display:"flex", justifyContent:"center", gap:"12px"}}>
              <button onClick={()=>navigate("/login")} style={{padding:"10px 22px", borderRadius:"10px", border:"none", background:"#a87c5f", color:"white", cursor:"pointer"}}>Login</button>
              <button onClick={()=>navigate("/registration")} style={{padding:"10px 22px", borderRadius:"10px", border:"1px solid #a87c5f", background:"#fffaf5", color:"#a87c5f", cursor:"pointer"}}>Register</button>
            </div>
            <button onClick={()=>setShowLoginModal(false)} style={{marginTop:"15px", fontSize:"0.85rem", background:"none", border:"none", color:"#7d5c3b", cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default BookingPage;