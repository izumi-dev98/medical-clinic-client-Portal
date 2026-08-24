import { useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

function getImage(service, images, index, storageUrl) {
  const value = service.cloudinary_url || service.image_url || service.image_urls?.[0] || (service.cloudinary_public_id ? `cloudinary:${service.cloudinary_public_id}` : null) || images[index % Math.max(images.length, 1)]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl('service-images', value)
}

export default function ServicesPage({ content, storageUrl }) {
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => window.innerWidth <= 700 ? 3 : 6)
  const services = useMemo(() => (content.services || []).filter((service) => `${service.title} ${service.description}`.toLowerCase().includes(search.toLowerCase())), [content.services, search])
  const totalPages = Math.max(1, Math.ceil(services.length / pageSize))
  const visibleServices = services.slice((page - 1) * pageSize, page * pageSize)
  const images = content.images['service-images'] || []

  useEffect(() => {
    const handleResize = () => {
      const nextPageSize = window.innerWidth <= 700 ? 3 : 6
      setPageSize((currentPageSize) => {
        if (currentPageSize !== nextPageSize) setPage(1)
        return nextPageSize
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="site-shell services-page">
      <Navbar clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
      <section className="doctors-hero"><div className="doctors-hero-row"><div><p className="section-tag"><span>Our services</span></p><h1>Care for every <i>need.</i></h1></div><label className="doctor-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search services" aria-label="Search services" /></label></div></section>
      <section className="doctors-directory"><div className="doctor-grid">{visibleServices.length ? visibleServices.map((service, index) => { const image = getImage(service, images, index, storageUrl); return <button className="doctor-card" type="button" key={service.id || index} onClick={() => setSelectedService(service)}><div className="doctor-photo">{image ? <img src={image} alt={service.title} /> : <span className="service-placeholder">+</span>}</div><div className="doctor-info"><span>Specialist care</span><h3>{service.title || 'Healthcare service'}</h3><p>{service.description}</p><b className="doctor-profile-link">View service ↗</b></div></button> }) : <div className="no-results"><strong>No services found.</strong><p>Try another service name.</p></div>}</div>{services.length > pageSize && <div className="doctor-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>Previous</button><span>{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button></div>}</section>
      {selectedService && <div className="doctor-modal-backdrop" role="presentation" onClick={() => setSelectedService(null)}><article className="doctor-modal" role="dialog" aria-modal="true" aria-label={`${selectedService.title} service`} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedService(null)} aria-label="Close service">×</button>{getImage(selectedService, images, 0, storageUrl) ? <img className="modal-profile-image service-modal-image" src={getImage(selectedService, images, 0, storageUrl)} alt={selectedService.title} /> : <div className="modal-image-fallback">+</div>}<p className="kicker"><span></span> Specialist care</p><h2>{selectedService.title}</h2><p className="modal-bio">{selectedService.description}</p><div className="modal-contact"><span>Talk with our care team</span><a href={`#doctors`}>Find a doctor ↗</a></div></article></div>}
      <SiteFooter clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} compact />
    </main>
  )
}
