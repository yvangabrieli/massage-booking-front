import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>TO. KA. ME</h1>
              <p>
                Masajes personalizados para el bienestar del cuerpo y la mente.
                Tratamientos a medida en un ambiente acogedor y relajante.
              </p>

              <Link to="/booking">
                <button className="hero-btn mb-4">
                  Reserva tu momento de relax
                </button>
              </Link>
            </div>

            <div className="col-md-6 text-center">
              <img
                src="/hero.png"
                alt="massaggi"
                className="img-fluid rounded custom-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CHI SONO */}
      <section className="section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src="/yvan-1.png"
                alt="operatrice"
                className="img-fluid rounded custom-img"
              />
            </div>

            <div className="col-md-6">
              <h2>Quien soy</h2>
              <p>
                Me llamo Yvan y soy masajador profesional. Desde el primer
                contacto, mi intención es que te sientas en confianza y puedas
                desconectar del estrés diario. Trabajo con manos firmes y
                precisas, adaptando cada movimiento a lo que tu cuerpo necesita
                en ese momento. Combino técnicas de presión profunda con
                movimientos suaves y fluidos para aliviar tensiones musculares
                y, al mismo tiempo, generar una sensación de calma. Presto
                atención a cada detalle: tu respiración, tu postura, la
                intensidad adecuada. Para mí, un masaje no es solo un servicio,
                es una experiencia integral de bienestar. Me caracterizo por mi
                profesionalismo, puntualidad y respeto. Mi objetivo es que cada
                sesión sea un espacio seguro donde puedas relajarte
                completamente y salir renovado, tanto física como mentalmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* I MIEI PERCORSI */}
      <section className="section" style={{ backgroundColor: "#efe6d8" }}>
        <div className="container">
          <h2>Mis tratamientos</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-custom text-center border rounded shadow-sm h-100">
                <h4>Relax Profundo</h4>
                <p>
                  Masaje suave y envolvente para reducir el estrés y calmar la
                  mente. Ideal para desconectar y recuperar equilibrio físico y
                  emocional.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-custom text-center border rounded shadow-sm h-100">
                <h4>Deep Tissue</h4>
                <p>
                  Técnica de presión firme que trabaja las capas profundas del
                  músculo. Perfecto para contracturas y tensiones crónicas.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-custom text-center border rounded shadow-sm h-100">
                <h4>Descontracturante Localizado</h4>
                <p>
                  Enfocado en zonas específicas con dolor o rigidez. Alivia
                  puntos de tensión y mejora la movilidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICI */}
      {/* BENEFICI */}
      <section className="section" style={{ backgroundColor: "#f8f5f0" }}>
        <div className="container text-center">
          <h2 className="mb-5">¿Por qué elegirme?</h2>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <div className="mb-3">
                  <i className="bi bi-heart-pulse fs-1"></i>
                </div>
                <h5>Atención personalizada</h5>
                <p>
                  Cada sesión se adapta a tus necesidades físicas y emocionales.
                  No hay tratamientos estándar, solo lo que tu cuerpo necesita.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <div className="mb-3">
                  <i className="bi bi-house-heart fs-1"></i>
                </div>
                <h5>Ambiente acogedor</h5>
                <p>
                  Un espacio tranquilo y cuidado al detalle para que puedas
                  desconectar completamente del estrés diario.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <div className="mb-3">
                  <i className="bi bi-award fs-1"></i>
                </div>
                <h5>Profesionalidad</h5>
                <p>
                  Puntualidad, respeto y máxima discreción. Tu bienestar es
                  siempre la prioridad.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <div className="mb-3">
                  <i className="bi bi-stars fs-1"></i>
                </div>
                <h5>Experiencia integral</h5>
                <p>
                  No es solo un masaje, es un momento de reconexión entre cuerpo
                  y mente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="cta">
        <div className="container">
          <h2 className="mb-4">Concédete tu momento de bienestar</h2>
          <Link to="/booking">
            <button className="hero-btn">Reserva ahora</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
