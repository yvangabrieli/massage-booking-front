import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SoundButton = ({ playing, onToggle }) => (
  <button
    onClick={onToggle}
    title={playing ? "Pause ambient music" : "Play ambient music"}
    className="sound-button"
  >
    {playing ? "🔊" : "🔇"}
  </button>
);

const Home = () => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef([]);
  const pageMusicRef = useRef(null); // xxxxxx For background music

  // Ambient sound (sine wave) - optional
  const startAmbient = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    master.connect(ctx.destination);

    const freqs = [110, 165, 220, 275, 330];
    nodesRef.current = freqs.map((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.005, ctx.currentTime + 4 + i);
      osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 8 + i);
      gain.gain.setValueAtTime(0.15 - i * 0.02, ctx.currentTime);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      return { osc, gain };
    });
  };

  const stopAmbient = () => {
    if (audioCtxRef.current) {
      nodesRef.current.forEach(({ osc }) => { try { osc.stop(); } catch {} });
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      nodesRef.current = [];
    }
  };

  const handleMusicToggle = () => {
    if (musicPlaying) {
      stopAmbient();
      if (pageMusicRef.current) pageMusicRef.current.pause(); // xxxxxx pause page music
      setMusicPlaying(false);
    } else {
      startAmbient();
      if (pageMusicRef.current) pageMusicRef.current.play(); // xxxxxx play page music
      setMusicPlaying(true);
    }
  };

  useEffect(() => () => stopAmbient(), []);

  return (
    <main>
      {/* Sound toggle button */}
      <SoundButton playing={musicPlaying} onToggle={handleMusicToggle} />

      {/* xxxxxx Page ambient music */}
      <audio ref={pageMusicRef} loop>
        <source src="/sounds/forest.mp3" type="audio/mpeg" />
        Your browser does not support audio.
      </audio>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <video
            autoPlay
            muted
            loop
            className="hero-video"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/videos/TokameVideo.mp4" type="video/mp4" /> {/* xxxxxx place your video */}
            Your browser does not support the video tag.
          </video>
          <div className="hero-gradient" />
        </div>

        {/* Hero content with cream background */}
        <div className="hero-content" style={{ backgroundColor: "rgba(255, 245, 225, 0.6)", padding: "2rem", borderRadius: "20px" }}>

          <p style={{ letterSpacing: "0.35em", textTransform: "uppercase", color: "#6E4B2B", fontWeight: 600, marginBottom: "1rem" }}>
            Professional Massage Therapy
          </p>
          <h1 style={{ fontSize: "clamp(56px, 6vw, 112px)", color: "#4B3621" }}>
            T  O  K  A  M  E
          </h1>
          <p style={{ marginTop: "1.5rem", fontSize: "1.15rem", lineHeight: 1.8, maxWidth: "480px", color: "#66503B" }}>
            Personalised massage therapy for body and mind. Tailored treatments in a warm, welcoming environment designed for your complete wellbeing.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/booking">
              <button className="btn-primary" onClick={() => new Audio("/sounds/1.mp3").play()}>Book Your Session</button> {/* xxxxxx click sound */}
            </Link>
            <a href="#touch">
              <button className="btn-outline" onClick={() => new Audio("/sounds/2.mp3").play()}>Discover More</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── TOUCH SECTION ── */}
      <section id="About Us" className="section" style={{ backgroundColor: "#FFF5E1", position: "relative", overflow: "hidden" }}>
        <div className="african-pattern" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <h2>About Us</h2>
          <p>
            Each session begins with a hands-on approach that reconnects your body and mind. Warm, precise movements adapt to your needs, creating a sense of calm and relief.
          </p>

          {/* Horizontal scrolling gallery */}
          <div className="scrolling-gallery">
            <div className="scrolling-track">
              <img src="/images/1.jpg" alt="Touch 1" />
              <img src="/images/2.jpg" alt="Touch 2" />
              <img src="/images/3.jpg" alt="Touch 3" />
              <img src="/images/4.jpg" alt="Touch 4" />
              <img src="/images/5.jpg" alt="Touch 5" />

              {/* Duplicate for seamless loop */}
              <img src="/images/1.jpg" alt="Touch 1" />
              <img src="/images/2.jpg" alt="Touch 2" />
              <img src="/images/3.jpg" alt="Touch 3" />
              <img src="/images/4.jpg" alt="Touch 4" />
              <img src="/images/5.jpg" alt="Touch 5" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;