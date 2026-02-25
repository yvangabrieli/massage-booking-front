import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <h5>Tokame</h5>
          <p>Professional massage therapy tailored to your body and mind. Your wellbeing is always the priority.</p>
        </div>
        <div className="col-md-4">
          <h5>Opening Hours</h5>
          <p>Thursday – Sunday<br />10:00 – 20:00<br /><small style={{ opacity: 0.6 }}>Monday – Wednesday: Closed</small></p>
        </div>
        <div className="col-md-4">
          <h5>Quick Links</h5>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/booking">Book a Session</Link></p>
          <p><Link to="/contacts">Contact</Link></p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} T O K A M E · All rights reserved</div>
    </div>
  </footer>
);

export default Footer;
