import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SoundButton = ({ playing, onToggle }) => (
  <button
    onClick={onToggle}
    title={playing ? "Pause ambient music" : "Play ambient music"}
    style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 999,
      width: "54px", height: "54px", borderRadius: "50%",
      background: "var(--brown)", border: "none", cursor: "pointer",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "transform 0.2s, background 0.2s",
      fontSize: "1.4rem",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
  >
    {playing ? "🔊" : "🔇"}
  </button>
);

const Home = () => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef([]);

  // Generate ambient tones using Web Audio API (no external file needed)
  const startAmbient = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    master.connect(ctx.destination);

    const freqs = [110, 165, 220, 275, 330];
    const created = freqs.map((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Gentle LFO wobble
      osc.frequency.linearRampToValueAtTime(freq * 1.005, ctx.currentTime + 4 + i);
      osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 8 + i);
      gain.gain.setValueAtTime(0.15 - i * 0.02, ctx.currentTime);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      return { osc, gain };
    });
    nodesRef.current = created;
  };

  const stopAmbient = () => {
    if (audioCtxRef.current) {
      const master = audioCtxRef.current.createGain();
      nodesRef.current.forEach(({ osc }) => { try { osc.stop(); } catch (e) {} });
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      nodesRef.current = [];
    }
  };

  const handleMusicToggle = () => {
    if (musicPlaying) {
      stopAmbient();
      setMusicPlaying(false);
    } else {
      startAmbient();
      setMusicPlaying(true);
    }
  };

  useEffect(() => () => stopAmbient(), []);

  return (
    <main>
      <SoundButton playing={musicPlaying} onToggle={handleMusicToggle} />

      {/* ── HERO ── */}
      <section className="hero" style={{ minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <p style={{ letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--brown)", fontWeight: 600, marginBottom: "1rem" }}>
                Professional Massage Therapy
              </p>
              <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.1, color: "var(--brown-dark)", fontWeight: 700 }}>
                TO. KA. ME
              </h1>
              <p style={{ marginTop: "1.5rem", fontSize: "1.15rem", lineHeight: 1.8, maxWidth: "480px", color: "#555" }}>
                Personalised massage therapy for body and mind. Tailored treatments in a warm, welcoming environment designed for your complete wellbeing.
              </p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Link to="/booking">
                  <button className="hero-btn" style={{ padding: "14px 36px", fontSize: "1rem" }}>
                    Book Your Session
                  </button>
                </Link>
                <a href="#about">
                  <button style={{ padding: "14px 36px", fontSize: "1rem", background: "transparent", border: "2px solid var(--brown)", borderRadius: "30px", color: "var(--brown)", cursor: "pointer", transition: "0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--brown)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--brown)"; }}>
                    About Me
                  </button>
                </a>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ position: "absolute", inset: "-12px", borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", background: "var(--cream)", zIndex: 0 }} />
                <img src="/hero.png" alt="massage therapy" className="img-fluid rounded" style={{ position: "relative", zIndex: 1, maxWidth: "460px", width: "100%", borderRadius: "20px" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section" style={{ background: "#faf7f2" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-5 text-center">
              <img src="/yvan-1.png" alt="Yvan — massage therapist"
                className="img-fluid" style={{ borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
            </div>
            <div className="col-md-7">
              <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--brown)", fontWeight: 600, fontSize: "0.85rem" }}>About Me</p>
              <h2 style={{ color: "var(--brown-dark)", fontWeight: 700, fontSize: "2.4rem", marginBottom: "1.5rem" }}>Hi, I'm Yvan</h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "#555" }}>
                I am a certified professional massage therapist. From the very first contact, my intention is for you to feel comfortable and be able to disconnect from daily stress. I work with firm, precise hands, adapting every movement to what your body needs in that moment.
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "#555", marginTop: "1rem" }}>
                I combine deep pressure techniques with smooth, flowing movements to relieve muscular tension and at the same time create a sense of calm. I pay attention to every detail — your breathing, your posture, the right intensity.
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "#555", marginTop: "1rem" }}>
                For me, a massage is not just a service — it is a complete wellbeing experience. I pride myself on professionalism, punctuality and respect. My goal is for every session to be a safe space where you can relax completely and leave renewed, both physically and mentally.
              </p>
              <div className="mt-4 d-flex gap-4 flex-wrap">
                {[["5+", "Years experience"], ["200+", "Happy clients"], ["100%", "Personalised"]].map(([num, label]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--brown)" }}>{num}</div>
                    <div style={{ fontSize: "0.85rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TREATMENTS ── */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--brown)", fontWeight: 600, fontSize: "0.85rem" }}>What I offer</p>
            <h2 style={{ color: "var(--brown-dark)", fontWeight: 700 }}>My Treatments</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "🌊", title: "Deep Relaxation", desc: "Soft, enveloping massage to reduce stress and calm the mind. Ideal for disconnecting and recovering physical and emotional balance." },
              { icon: "💪", title: "Deep Tissue", desc: "Firm pressure technique that works deep muscle layers. Perfect for contractures and chronic tension that won't let go." },
              { icon: "🦶", title: "Localised Relief", desc: "Focused on specific areas of pain or stiffness. Relieves tension points and improves mobility and range of movement." },
            ].map((t) => (
              <div key={t.title} className="col-md-4">
                <div className="card-custom h-100 text-center" style={{ padding: "2.5rem 2rem", borderRadius: "20px", transition: "transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{t.icon}</div>
                  <h4 style={{ color: "var(--brown-dark)", fontWeight: 700, marginBottom: "1rem" }}>{t.title}</h4>
                  <p style={{ color: "#666", lineHeight: 1.8 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ME ── */}
      <section className="section" style={{ background: "#f8f5f0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--brown)", fontWeight: 600, fontSize: "0.85rem" }}>Why choose me</p>
            <h2 style={{ color: "var(--brown-dark)", fontWeight: 700 }}>The Tokame Difference</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "❤️", title: "Personalised care", desc: "Every session adapts to your physical and emotional needs. No standard treatments — only what your body truly needs." },
              { icon: "🏡", title: "Welcoming environment", desc: "A quiet, carefully designed space so you can completely disconnect from daily stress and worries." },
              { icon: "🏅", title: "Professionalism", desc: "Punctuality, respect and full discretion at all times. Your wellbeing is always the priority, no exceptions." },
              { icon: "✨", title: "Whole-body experience", desc: "It's not just a massage — it's a moment of reconnection between body and mind, leaving you genuinely renewed." },
            ].map((item) => (
              <div key={item.title} className="col-md-3 col-sm-6">
                <div style={{ padding: "2rem 1.5rem", background: "white", borderRadius: "16px", height: "100%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
                  <h5 style={{ color: "var(--brown-dark)", fontWeight: 700, marginBottom: "0.75rem" }}>{item.title}</h5>
                  <p style={{ color: "#888", fontSize: "0.93rem", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENING HOURS ── */}
      <section className="section" style={{ background: "var(--brown-dark)", color: "white" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--cream)", fontWeight: 600, fontSize: "0.85rem" }}>When to find me</p>
              <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.5rem" }}>Opening Hours</h2>
              <table style={{ width: "100%", maxWidth: "340px" }}>
                <tbody>
                  {[["Thursday", "10:00 – 20:00"], ["Friday", "10:00 – 20:00"], ["Saturday", "10:00 – 20:00"], ["Sunday", "10:00 – 20:00"], ["Mon – Wed", "Closed"]].map(([day, hours]) => (
                    <tr key={day} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <td style={{ padding: "0.75rem 0", color: "var(--cream)", fontWeight: 500 }}>{day}</td>
                      <td style={{ padding: "0.75rem 0", textAlign: "right", color: hours === "Closed" ? "#888" : "white" }}>{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-6 text-center">
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2.5rem", display: "inline-block" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                <h4 style={{ color: "white", marginBottom: "0.5rem" }}>Ready to book?</h4>
                <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>Sessions available Thu–Sun. Book at least 2 hours in advance.</p>
                <Link to="/booking">
                  <button style={{ background: "var(--brown)", border: "none", color: "white", padding: "12px 32px", borderRadius: "30px", fontSize: "1rem", cursor: "pointer", transition: "0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--brown)"}>
                    Book Now →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="container">
          <h2 className="mb-3" style={{ fontWeight: 700 }}>Give yourself the wellbeing you deserve</h2>
          <p style={{ opacity: 0.85, marginBottom: "2rem", fontSize: "1.1rem" }}>Your body will thank you.</p>
          <Link to="/booking">
            <button className="hero-btn reserve">Book your session now</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
