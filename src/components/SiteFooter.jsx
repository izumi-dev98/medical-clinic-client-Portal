import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6'

function getClinicLogo(clinic, images, storageUrl) {
  const value = clinic?.profile_image_url || images?.[0]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl?.('clinic-images', value)
}

const socialFields = [
  ['facebook', 'Facebook', FaFacebookF],
  ['tiktok', 'TikTok', FaTiktok],
  ['youtube', 'YouTube', FaYoutube],
  ['instagram', 'Instagram', FaInstagram],
  ['x', 'X', FaXTwitter],
  ['telegram', 'Telegram', FaTelegram],
  ['linkedin', 'LinkedIn', FaLinkedinIn],
]

function getSocialLinks(clinic) {
  let socialUrls = clinic.social_urls
  if (typeof socialUrls === 'string') {
    try {
      socialUrls = JSON.parse(socialUrls)
    } catch {
      socialUrls = null
    }
  }

  const findSocial = (name, url) => {
    const normalizedName = String(name || url || '').toLowerCase()
    const social = socialFields.find(([field]) => normalizedName === field || normalizedName.includes(field) || (field === 'x' && normalizedName.includes('twitter')))
    return url && social ? { label: social[1], Icon: social[2], url } : null
  }

  const explicitLinks = Array.isArray(socialUrls) ? socialUrls.map((item) => {
    if (typeof item === 'string') return findSocial('', item)
    return findSocial(item.platform || item.name || item.network, item.url || item.link || item.href)
  }).filter(Boolean) : socialUrls ? Object.entries(socialUrls).map(([name, value]) => {
    const url = typeof value === 'string' ? value : value?.url || value?.link || value?.href
    return findSocial(name, url)
  }).filter(Boolean) : []

  const fieldLinks = socialFields.map(([name, label, icon]) => {
    const key = Object.keys(clinic).find((field) => field.toLowerCase().replace(/_url$/, '').includes(name) || (name === 'x' && field.toLowerCase().includes('twitter')))
    const url = key && clinic[key]
    return url ? { label, Icon: icon, url } : null
  }).filter(Boolean)

  return [...explicitLinks, ...fieldLinks.filter(({ label }) => !explicitLinks.some((link) => link.label === label))]
}

export default function SiteFooter({ clinic = {}, images, storageUrl, compact = false }) {
  const clinicInfo = clinic || {}
  const logo = getClinicLogo(clinicInfo, images, storageUrl)
  const address = clinicInfo.address || '12 Greenway Avenue, New York, NY 10001'
  const email = clinicInfo.email || 'hello@noshclinic.com'
  const phone = clinicInfo.phone || '+1 212 555 0188'
  const emergencyPhone = clinicInfo.emergency_phone || '+1 212 555 0199'
  const socialLinks = getSocialLinks(clinicInfo)

  return (
    <footer>
      <a className="logo" href="#home">{logo ? <img className="logo-image" src={logo} alt="" /> : <span className="logo-mark">+</span>}<span>{clinicInfo.clinic_title || 'NOSH'}<small>WELLNESS CLINIC</small></span></a>
      <div><p>{address}</p><a href={`mailto:${email}`}>{email}</a></div>
      {!compact && <div className="footer-phone"><a href={`tel:${phone}`}>{phone}</a><span>Emergency: {emergencyPhone}</span></div>}
      {socialLinks.length > 0 && <nav className="footer-socials" aria-label="Social media links">{socialLinks.map(({ label, Icon, url }) => <a href={url} key={label} target="_blank" rel="noreferrer" aria-label={label}><Icon aria-hidden="true" /></a>)}</nav>}
    </footer>
  )
}
