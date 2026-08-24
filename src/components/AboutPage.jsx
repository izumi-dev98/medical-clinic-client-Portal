import { useEffect } from 'react'
import Swal from 'sweetalert2'
import Navbar from './Navbar'
import SiteFooter from './SiteFooter'

const imageKeys = ['image_url', 'image', 'photo_url', 'award_image_url', 'profile_image_url']

function getImage(row, bucket, storageUrl, fallback) {
  const value = imageKeys.map((key) => row?.[key]).find(Boolean) || row?.image_urls?.[0]
  if (value) return value.startsWith('http') ? value : storageUrl(bucket, value)
  return fallback ? storageUrl(bucket, fallback) : null
}

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export default function AboutPage({ content, loading, error, storageUrl }) {
  useEffect(() => {
    if (error) Swal.fire({ icon: 'warning', title: 'Clinic details unavailable', text: error, confirmButtonColor: '#20b486' })
  }, [error])

  const clinic = content.clinic || {}
  const missionItems = content.mission.length ? content.mission : [{ section_type: 'Mission', title: 'Care that feels human', description: 'Thoughtful healthcare that puts every patient at the center.' }]
  const approachColumns = ['Mission', 'Vision', 'Core Value'].map((sectionType) => {
    const records = missionItems.filter((item) => item.section_type === sectionType)
    const firstRecord = records[0] || missionItems[0]
    return {
      ...firstRecord,
      section_type: sectionType === 'Core Value' ? 'Core Values' : sectionType,
      records: records.length ? records : [firstRecord],
    }
  })
  const clinicImage = getImage(clinic, 'clinic-images', storageUrl, content.images['clinic-images']?.[0]?.name)

  return (
    <main className="site-shell" id="about-page">
      <Navbar clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />

      <section className="hero-new" id="top">
        <div className="hero-new-copy animate__animated animate__fadeInUp">
          <p className="kicker"><span></span> About us</p>
            <h1>{clinic.clinic_title || 'Our clinic'}</h1>
          <p className="hero-new-text">{clinic.about_us || 'Compassionate primary care and specialist services for healthier families.'}</p>
        </div>
        <div className="hero-new-image animate__animated animate__fadeIn">
          <div className="image-frame">{clinicImage ? <img src={clinicImage} alt={clinic.clinic_title || 'Clinic'} /> : <div className="image-fallback">A calmer<br /><i>kind</i> of care.</div>}<span className="image-stamp">EST.<br /><b>2026</b></span></div>
        </div>
      </section>


      <section className="approach-new" id="values"><div className="approach-heading"><div className="section-tag light"></div><h2>How we make<br /><i>care better.</i></h2></div><div className="approach-list">{approachColumns.map((item, index) => { const image = getImage(item, 'mission-images', storageUrl, content.images['mission-images']?.[index % Math.max(content.images['mission-images']?.length || 1, 1)]?.name); return <article key={item.section_type}><span className="approach-number">0{index + 1}</span>{image ? <img src={image} alt={item.section_type} /> : <span className="approach-image-fallback">+</span>}<div><span className="approach-type">{item.section_type}</span>{item.records.map((record, recordIndex) => <div className="approach-record" key={record.id || recordIndex}><h3>{record.title || item.section_type}</h3><p>{record.description}</p></div>)}</div><a href="#values" aria-label={`Learn about ${item.section_type}`}><Arrow /></a></article> })}</div></section>

      <section className="recognition-new" id="awards"><div className="section-tag"><span>03</span></div><div className="recognition-content"><h2>Trusted by our<br /><i>community.</i></h2><div className="award-list-new">{loading ? <p>Loading recognition...</p> : content.awards.length ? content.awards.map((award, index) => { const image = getImage(award, 'award-images', storageUrl, content.images['award-images']?.[index % Math.max(content.images['award-images']?.length || 1, 1)]?.name); return <article key={award.id || index}>{image && <img src={image} alt="" />}<div><span>Recognition / {award.year || award.award_year || '2026'}</span><h3>{award.title || award.name || award.award_name || 'Community healthcare recognition'}</h3><p>{award.description}</p></div><Arrow /></article> }) : <p>Recognition is on its way.</p>}</div></div></section>

      <SiteFooter clinic={clinic} images={content.images['clinic-images']} storageUrl={storageUrl} />
    </main>
  )
}
