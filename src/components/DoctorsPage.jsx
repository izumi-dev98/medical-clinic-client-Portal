import { useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

const imageKeys = ['cloudinary_url', 'image_url', 'image', 'photo_url', 'profile_image_url', 'cloudinary_public_id']

function getImage(doctor, storageUrl) {
  const value = doctor?.cloudinary_url || (doctor?.cloudinary_public_id ? `cloudinary:${doctor.cloudinary_public_id}` : null) || imageKeys.map((key) => doctor?.[key]).find(Boolean)
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl('doctor-images', value)
}

function initials(name = 'Doctor') {
  return name.replace(/^Dr\.\s*/i, '').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function DoctorsPage({ content, storageUrl }) {
  const [search, setSearch] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => window.innerWidth <= 700 ? 3 : 6)
  const images = content.images['doctor-images'] || []
  const filteredDoctors = useMemo(() => (content.doctors || []).filter((doctor) => `${doctor.doctor_name} ${doctor.qualifications} ${doctor.facility}`.toLowerCase().includes(search.toLowerCase())), [content.doctors, search])
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / pageSize))
  const visibleDoctors = filteredDoctors.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth <= 700 ? 3 : 6)
      setPage(1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="site-shell">
      <Navbar clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
      <section className="doctors-hero"><div className="doctors-hero-row"><div><p className="section-tag"><span>Our doctors</span></p><h1>Find your <i>care team.</i></h1></div><label className="doctor-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search by name or specialty" aria-label="Search doctors" /></label></div></section>
      <section className="doctors-directory"><div className="doctor-grid">{visibleDoctors.length ? visibleDoctors.map((doctor, index) => { const image = getImage(doctor, storageUrl) || (images.length ? storageUrl('doctor-images', images[index % images.length].name) : null); return <button className="doctor-card" type="button" key={doctor.id || index} onClick={() => setSelectedDoctor(doctor)}><div className="doctor-photo">{image ? <img src={image} alt={doctor.doctor_name} /> : <span>{initials(doctor.doctor_name)}</span>}</div><div className="doctor-info"><span>{doctor.facility || 'NOSH Clinic'}</span><h3>{doctor.doctor_name || 'Our specialist'}</h3><p>{doctor.qualifications || 'Healthcare specialist'}</p><b className="doctor-profile-link">View profile ↗</b></div></button> }) : <div className="no-results"><strong>No doctors found.</strong><p>Try another name, specialty, or facility.</p></div>}</div>{filteredDoctors.length > pageSize && <div className="doctor-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>Previous</button><span>{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button></div>}</section>
      {selectedDoctor && <div className="doctor-modal-backdrop" role="presentation" onClick={() => setSelectedDoctor(null)}><article className="doctor-modal" role="dialog" aria-modal="true" aria-label={`${selectedDoctor.doctor_name} profile`} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedDoctor(null)} aria-label="Close profile">×</button>{getImage(selectedDoctor, storageUrl) ? <img className="modal-profile-image" src={getImage(selectedDoctor, storageUrl)} alt={selectedDoctor.doctor_name} /> : <div className="modal-image-fallback">{selectedDoctor.doctor_name}</div>}<p className="kicker"><span></span> {selectedDoctor.facility || 'NOSH Clinic'}</p><h2>{selectedDoctor.doctor_name}</h2><p className="modal-specialty">{selectedDoctor.qualifications}</p><p className="modal-bio">{selectedDoctor.biography || 'Dedicated to providing thoughtful, patient-first care.'}</p><div className="modal-contact"><span>{selectedDoctor.address}</span><a href={`tel:${selectedDoctor.phone || ''}`}>{selectedDoctor.phone || 'Call clinic'} ↗</a></div></article></div>}
      <SiteFooter clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} compact />
    </main>
  )
}
