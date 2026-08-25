import Navbar from './Navbar'
import SiteFooter from './SiteFooter'
import './HomePage.css'

function getClinicImage(clinic, images, storageUrl) {
  const value = clinic.cloudinary_url || clinic.profile_image_url || (clinic.cloudinary_public_id ? `cloudinary:${clinic.cloudinary_public_id}` : null) || images?.[0]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl('clinic-images', value)
}

function getPreviewImage(item, bucket, images, index, storageUrl) {
  const value = item.cloudinary_url || item.image_url || item.image_urls?.[0] || (item.cloudinary_public_id ? `cloudinary:${item.cloudinary_public_id}` : null) || images?.[index % Math.max(images.length, 1)]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl(bucket, value)
}

export default function HomePage({ content, storageUrl }) {
  const clinic = content.clinic || {}
  const image = getClinicImage(clinic, content.images['clinic-images'], storageUrl)
  return (
    <main className="site-shell home-page">
      <Navbar clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />

      <section className="home-hero">
        <div className="home-copy animate__animated animate__fadeInUp"><p className="kicker"><span></span> Welcome to {clinic.clinic_title || 'NOSH'}</p><h1>Your health,<br /><i>in good hands.</i></h1><p>{clinic.about_us || 'Compassionate primary care and specialist services for healthier families.'}</p><a className="solid-button home-learn-more" href="#about-page">Learn more <span aria-hidden="true">↗</span></a></div>
        <div className="home-visual animate__animated animate__fadeIn">{image ? <img className="home-visual-image" src={image} alt={clinic.clinic_title || 'Clinic'} /> : <div className="image-fallback">A calmer<br /><i>kind</i> of care.</div>}</div>
      </section>


      <section className="home-about-preview"><div><p className="section-tag"><span>About us</span></p><h2>{clinic.clinic_title || 'NOSH Wellness Clinic'}</h2></div><div><p>{clinic.about_us || 'Compassionate primary care and specialist services for healthier families.'}</p><a className="text-button" href="#about-page">Learn more <span aria-hidden="true">↗</span></a></div></section>
      <section className="home-preview-section"><div className="preview-heading"><div><p className="section-tag"><span>Meet the team</span></p><h2>People who<br /><i>care deeply.</i></h2></div><a className="text-button" href="#doctors">View all doctors <span aria-hidden="true">↗</span></a></div><div className="preview-grid">{content.doctors.slice(0, 3).map((doctor, index) => { const image = getPreviewImage(doctor, 'doctor-images', content.images['doctor-images'], index, storageUrl); return <a className="preview-card" href="#doctors" key={doctor.id || index}>{image && <img className="preview-card-image" src={image} alt="" />}<h3>{doctor.doctor_name}</h3><p>{doctor.qualifications}</p><b>View profile ↗</b></a> })}</div></section>
      <section className="home-services" id="services"><div className="section-heading-home"><p className="section-tag"><span>What we offer</span></p><h2>Care for every<br /><i>part of life.</i></h2><a className="text-button" href="#about-page">About our approach <span aria-hidden="true">↗</span></a></div><div className="service-grid">{content.services.length ? content.services.map((service, index) => { const image = getPreviewImage(service, 'service-images', content.images['service-images'], index, storageUrl); return <article key={service.id || index}>{image && <img className="service-card-image" src={image} alt="" />}<h3>{service.title || service.name}</h3><p>{service.description}</p><span className="service-arrow" aria-hidden="true">↗</span></article> }) : <p>Our services are being updated.</p>}</div></section>
      <section className="home-preview-section home-offers"><div className="preview-heading"><div><p className="section-tag"><span>Packages & promotions</span></p><h2>Good care,<br /><i>made simple.</i></h2></div><a className="text-button" href="#medical-packages">Explore offers <span aria-hidden="true">↗</span></a></div><div className="preview-grid"><div className="preview-column"><h3>Medical packages</h3>{content.packages.slice(0, 2).map((item, index) => <a className="offer-row" href="#medical-packages" key={item.id || index}><strong>{item.title}</strong><em>{item.price ? `$${item.price}` : 'View'} ↗</em></a>)}</div><div className="preview-column"><h3>Promotions</h3>{content.promotions.slice(0, 2).map((item, index) => <a className="offer-row" href="#promotions" key={item.id || index}><strong>{item.title}</strong><em>{item.discount_value ? `${item.discount_value}${item.discount_type === 'Percentage' ? '%' : ''} off` : 'View'} ↗</em></a>)}</div></div></section>
      <section className="appointment-section" id="appointment"><div><p className="section-tag"><span>Appointments</span></p><h2>Ready to take<br /><i>the next step?</i></h2></div><button className="solid-button" type="button" onClick={() => window.dispatchEvent(new Event('open-appointment'))}>Book an appointment <span aria-hidden="true">↗</span></button></section>
      <section className="home-intro"><p className="section-tag"><span>Our promise</span></p><h2>Care that meets<br /><i>you where you are.</i></h2><a className="solid-button" href="#about-page">Meet the clinic <span aria-hidden="true">↗</span></a></section>
      <SiteFooter clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
    </main>
  )
}
