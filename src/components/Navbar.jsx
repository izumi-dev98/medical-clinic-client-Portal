import { useState } from 'react'

function getClinicLogo(clinic, images, storageUrl) {
  const value = clinic?.profile_image_url || images?.[0]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl?.('clinic-images', value)
}

export default function Navbar({ clinic, images, storageUrl }) {
  const logo = getClinicLogo(clinic, images, storageUrl)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="topbar animate__animated animate__fadeInDown">
      <a className="logo" href="#home" aria-label="Go home">{logo ? <img className="logo-image" src={logo} alt="" /> : <span className="logo-mark">+</span>}<span>{clinic?.clinic_title || 'NOSH'}<small>WELLNESS CLINIC</small></span></a>
      <button className="nav-menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Close' : 'Menu'}</button>
      <div className={`nav-links${menuOpen ? ' is-open' : ''}`} id="site-navigation"><a href="#home" onClick={() => setMenuOpen(false)}>Home</a><a href="#about-page" onClick={() => setMenuOpen(false)}>About us</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#doctors" onClick={() => setMenuOpen(false)}>Doctors</a><a href="#management-team" onClick={() => setMenuOpen(false)}>Management Team</a><a href="#medical-packages" onClick={() => setMenuOpen(false)}>Medical Packages</a><a href="#promotions" onClick={() => setMenuOpen(false)}>Promotions</a><a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a><a href="#corporate" onClick={() => setMenuOpen(false)}>Corporate</a><a href="#appointment" onClick={(event) => { event.preventDefault(); setMenuOpen(false); window.dispatchEvent(new Event('open-appointment')) }}>Appointment</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact us</a></div>
    </nav>
  )
}
