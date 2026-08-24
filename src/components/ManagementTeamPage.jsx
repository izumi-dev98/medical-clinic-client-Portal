import { useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

function getImage(member, images, index, storageUrl) {
  const value = member.cloudinary_url || member.image_url || (member.cloudinary_public_id ? `cloudinary:${member.cloudinary_public_id}` : null) || images[index % Math.max(images.length, 1)]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl('team-images', value)
}

function initials(name = 'Team member') {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export default function ManagementTeamPage({ content, storageUrl }) {
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => window.innerWidth <= 700 ? 3 : 6)
  const members = useMemo(() => (content.managementTeam || []).filter((member) => `${member.name} ${member.position} ${member.department}`.toLowerCase().includes(search.toLowerCase())), [content.managementTeam, search])
  const totalPages = Math.max(1, Math.ceil(members.length / pageSize))
  const visibleMembers = members.slice((page - 1) * pageSize, page * pageSize)
  const images = content.images['team-images'] || []

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth <= 700 ? 3 : 6)
      setPage(1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="site-shell team-page">
      <Navbar clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
      <section className="doctors-hero"><div className="doctors-hero-row"><div><p className="section-tag"><span>Management team</span></p><h1>Meet the people<br /><i>who make care happen.</i></h1></div><label className="doctor-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search by name or department" aria-label="Search management team" /></label></div></section>
      <section className="doctors-directory"><div className="doctor-grid">{visibleMembers.length ? visibleMembers.map((member, index) => { const image = getImage(member, images, index, storageUrl); return <button className="doctor-card" type="button" key={member.id || index} onClick={() => setSelectedMember(member)}><div className="doctor-photo">{image ? <img src={image} alt={member.name} /> : <span>{initials(member.name)}</span>}</div><div className="doctor-info"><span>{member.department || 'Clinic leadership'}</span><h3>{member.name}</h3><p>{member.position || 'Management team'}</p><b className="doctor-profile-link">View profile ↗</b></div></button> }) : <div className="no-results"><strong>No team members found.</strong><p>Try another name or department.</p></div>}</div>{members.length > pageSize && <div className="doctor-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>Previous</button><span>{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button></div>}</section>
      {selectedMember && <div className="doctor-modal-backdrop" role="presentation" onClick={() => setSelectedMember(null)}><article className="doctor-modal" role="dialog" aria-modal="true" aria-label={`${selectedMember.name} profile`} onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedMember(null)} aria-label="Close profile">×</button>{getImage(selectedMember, images, 0, storageUrl) ? <img className="modal-profile-image" src={getImage(selectedMember, images, 0, storageUrl)} alt={selectedMember.name} /> : <div className="modal-image-fallback">{selectedMember.name}</div>}<p className="kicker"><span></span> {selectedMember.department || 'Clinic leadership'}</p><h2>{selectedMember.name}</h2><p className="modal-specialty">{selectedMember.position}</p><p className="modal-bio">{selectedMember.description || 'Dedicated to making every patient experience thoughtful and seamless.'}</p></article></div>}
      <SiteFooter clinic={content.clinic} images={content.images['clinic-images']} storageUrl={storageUrl} compact />
    </main>
  )
}
