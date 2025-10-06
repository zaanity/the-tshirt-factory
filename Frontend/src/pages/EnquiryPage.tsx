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
          <a href="mailto:sales@brand.com">thetshirtfactory2003@gmail.com</a>
        </li>
        <li>
          <a href="https://wa.me/+918319030372" target="_blank" rel="noopener noreferrer">
            WhatsApp: +91 83190 30372
          </a>
        </li>
        <li>Phone: +1 234 567 890</li>
      </ul>
      <p>
        Our sales team responds within 1 business day.
      </p>
    </section>
  </MainLayout>
);

export default ContactPage;