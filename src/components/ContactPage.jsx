import { useState } from 'react'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'
import './ContactPage.css'

export default function ContactPage({ content, storageUrl }) {
  const clinic = content.clinic || {}
  const address = clinic.address || '12 Greenway Avenue, New York, NY 10001'
  const email = clinic.email || 'hello@noshclinic.com'
  const phone = clinic.phone || '+1 212 555 0188'
  const emergencyPhone = clinic.emergency_phone || '+1 212 555 0199'
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <main className="site-shell contact-page">
      <Navbar clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />

      <section className="contact-hero">
        <div>
          <p className="section-tag"><span>Contact us</span></p>
          <h1>Let&apos;s talk about<br /><i>your care.</i></h1>
          <p className="contact-intro">Our care team is here to help with appointments, questions, and the next step in your health journey.</p>
        </div>
       
      </section>

      <section className="contact-layout">
        <div className="contact-details">
          <div className="contact-detail-block"><span>Visit us</span><address>{address}</address><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">Get directions ↗</a></div>
          <div className="contact-detail-block"><span>Call or email</span><a href={`tel:${phone}`}>{phone}</a><a href={`mailto:${email}`}>{email}</a></div>
          <div className="contact-detail-block"><span>Emergency line</span><a href={`tel:${emergencyPhone}`}>{emergencyPhone}</a><p>Available for urgent care guidance.</p></div>
        </div>
        <div className="contact-map"><iframe title={`Map showing ${address}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      </section>

      <section className="contact-form-section">
        <div><p className="section-tag"><span>Send a message</span></p><h2>We&apos;re here<br /><i>to listen.</i></h2></div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Name<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Phone<input name="phone" type="tel" /></label>
          <label>How can we help?<textarea name="message" rows="5" required /></label>
          <button className="solid-button" type="submit">Send message <span aria-hidden="true">↗</span></button>
          {submitted && <p className="contact-success" role="status">Thank you. Our care team will be in touch soon.</p>}
        </form>
      </section>

      <SiteFooter clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
    </main>
  )
}
