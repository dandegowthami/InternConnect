import { useState } from "react";
import { FaClock, FaEnvelope, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import "../styles/public.css";

const CONTACT_EMAIL = "InternConnect2025@gmail.com";

const CHANNELS = [
  { icon: FaEnvelope, title: "Email", text: CONTACT_EMAIL },
  { icon: FaPhoneAlt, title: "Phone", text: "+91 93470 40601" },
  { icon: FaClock, title: "Response time", text: "We reply within 24 hours, Monday to Friday" },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [opened, setOpened] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  // Opens the visitor's email client with the message pre-filled
  const handleSubmit = (event) => {
    event.preventDefault();
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
    setForm(EMPTY_FORM);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Get in touch</h1>
          <p>Questions about internships, recruiting or your account? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            {CHANNELS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="contact-item ic-card">
                <div className="feature-icon">
                  <Icon aria-hidden="true" />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-form ic-card">
            <h2>Send us a message</h2>
            <p className="text-muted mb-4">
              Fill in the form and your email app will open with the message ready to send.
            </p>

            {opened && (
              <div className="alert alert-success" role="status">
                Your email app should now be open. If it didn&apos;t open, write to us at {CONTACT_EMAIL}.
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label htmlFor="contact-name" className="form-label">
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="contact-email" className="form-label">
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="contact-subject" className="form-label">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  className="form-control"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="contact-message" className="form-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-control"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary btn-lg">
                  <FaPaperPlane aria-hidden="true" /> Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
