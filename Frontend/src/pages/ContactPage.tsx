import React from "react";
import MainLayout from "../components/MainLayout";
import "./ContactPage.css";

const ContactPage: React.FC = () => (
  <MainLayout>
    <section className="contact-section">
      <h1>Contact Our Team</h1>
      <p>
        For all wholesale enquiries, you may reach us directly at:
      </p>
      <ul>
        <li>
          <a href="mailto:thetshirtfactory2003@gmail.com">thetshirtfactory2003@gmail.com</a>
        </li>
        <li>
          <a href="https://wa.me/+918319030372" target="_blank" rel="noopener noreferrer">
            WhatsApp: +91 8982511109
          </a>
        </li>
        <li>Phone: +91 8982511109</li>
      </ul>
      <p>
        Our sales team responds within 1 business day.
      </p>
      <div className="map-container">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d919.8066570187178!2d75.88685154928625!3d22.75696936096913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396302a594519847%3A0x4dc5829dd0bcd2d8!2sChick-n-Serve%20Eat%20More%20Chicken!5e0!3m2!1sen!2sin!4v1757511486133!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <address className="company-address">
        2F, Scheme no. 54, Near Kasturi Sabhagrah, Vijay Nagar<br />
        Indore, M.P., 452001<br />
        India
      </address>
    </section>
  </MainLayout>
);

export default ContactPage;