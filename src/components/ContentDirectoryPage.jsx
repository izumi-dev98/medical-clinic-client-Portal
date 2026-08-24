import { useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

function getImage(item, bucket, images, index, storageUrl) {
  const value = item.cloudinary_url || item.image_url || item.image_urls?.[0] || (item.cloudinary_public_id ? `cloudinary:${item.cloudinary_public_id}` : null) || images[index % Math.max(images.length, 1)]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl(bucket, value)
}

function getItemDetails(item, type) {
  if (type === 'packages') return { label: item.duration || 'Care package', extra: item.price ? `$${item.price}` : item.short_description }
  if (type === 'promotions') return { label: item.promo_code || 'Limited offer', extra: item.discount_value ? `${item.discount_value}${item.discount_type === 'Percentage' ? '%' : ' off'}` : item.end_date }
  if (type === 'blog') return { label: item.category || 'Wellness', extra: item.published_date || item.status }
  return { label: 'Partnership', extra: 'For healthier teams' }
}

export default function ContentDirectoryPage({ content, storageUrl, type, bucket, eyebrow, title, searchPlaceholder }) {
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => window.innerWidth <= 700 ? 3 : 6)
  const images = content.images[bucket] || []
  const filteredItems = useMemo(() => (content[type] || []).filter((item) => `${item.title} ${item.description} ${item.short_description || ''} ${item.category || ''}`.toLowerCase().includes(search.toLowerCase())), [content, type, search])
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const visibleItems = filteredItems.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth <= 700 ? 3 : 6)
      setPage(1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="site-shell content-page">
      <Navbar clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
      <section className="doctors-hero"><div className="doctors-hero-row"><div><p className="section-tag"><span>{eyebrow}</span></p><h1>{title}</h1></div><label className="doctor-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={searchPlaceholder} aria-label={searchPlaceholder} /></label></div></section>
      <section className="doctors-directory"><div className="doctor-grid">{visibleItems.length ? visibleItems.map((item, index) => { const image = getImage(item, bucket, images, index, storageUrl); const details = getItemDetails(item, type); return <button className="doctor-card" type="button" key={item.id || index} onClick={() => setSelectedItem(item)}><div className="doctor-photo">{image ? <img src={image} alt={item.title} /> : <span className="service-placeholder">+</span>}</div><div className="doctor-info"><span>{details.label}</span><h3>{item.title || 'NOSH care'}</h3><p>{item.short_description || item.description}</p><b className="doctor-profile-link">View details ↗</b></div></button> }) : <div className="no-results"><strong>No results found.</strong><p>Try another search.</p></div>}</div>{filteredItems.length > pageSize && <div className="doctor-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>Previous</button><span>{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button></div>}</section>
      {selectedItem && <div className="doctor-modal-backdrop" role="presentation" onClick={() => setSelectedItem(null)}><article className="doctor-modal" role="dialog" aria-modal="true" aria-label={`${selectedItem.title} details`} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedItem(null)} aria-label="Close details">×</button>{getImage(selectedItem, bucket, images, 0, storageUrl) ? <img className="modal-profile-image" src={getImage(selectedItem, bucket, images, 0, storageUrl)} alt={selectedItem.title} /> : <div className="modal-image-fallback">+</div>}<p className="kicker"><span></span> {getItemDetails(selectedItem, type).label}</p><h2>{selectedItem.title}</h2><p className="modal-specialty">{getItemDetails(selectedItem, type).extra}</p><p className="modal-bio">{selectedItem.description || selectedItem.content || selectedItem.short_description}</p>{selectedItem.included_services && <p className="modal-bio"><strong>Includes:</strong> {selectedItem.included_services}</p>}<div className="modal-contact"><span>{type === 'blog' ? selectedItem.author || 'NOSH care team' : 'NOSH Wellness Clinic'}</span><a href="#home">Back home ↗</a></div></article></div>}
      <SiteFooter clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} compact />
    </main>
  )
}
