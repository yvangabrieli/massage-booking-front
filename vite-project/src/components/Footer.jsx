import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Colonna 1 */}
          <div className="col-md-4 mb-4">
            <h5>ToKaMe</h5>
            <p>
              Centro de bienestar dedicado a la relajación y al cuidado del
              cuerpo con tratamientos personalizados
            </p>
          </div>

          {/* Colonna 2 */}
          <div className="col-md-4 mb-4">
            <h5>Enlaces</h5>
            <p>
              <Link to="#">Home</Link>
            </p>
            <p>
              <Link to="/contacts">Contacto</Link>
            </p>
          </div>

          {/* Colonna 3 */}
          <div className="col-md-4 mb-4">
            <h5>Contacto</h5>
            <p>Email: info@email.com</p>
            <p>Teléfono: +34 123 456 7890</p>
            <p>Barcelona, Es</p>
          </div>
        </div>

        {/* Riga finale */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} Tokame – Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
