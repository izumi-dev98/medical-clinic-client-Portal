function getClinicLogo(clinic, images, storageUrl) {
  const value = clinic?.profile_image_url || images?.[0]?.name
  if (!value) return null
  return value.startsWith('http') ? value : storageUrl?.('clinic-images', value)
}

export default function SiteFooter({ clinic = {}, images, storageUrl, compact = false }) {
  const clinicInfo = clinic || {}
  const logo = getClinicLogo(clinicInfo, images, storageUrl)
  const address = clinicInfo.address || '12 Greenway Avenue, New York, NY 10001'
  const email = clinicInfo.email || 'hello@noshclinic.com'
  const phone = clinicInfo.phone || '+1 212 555 0188'
  const emergencyPhone = clinicInfo.emergency_phone || '+1 212 555 0199'

  return (
    <footer>
      <a className="logo" href="#home">{logo ? <img className="logo-image" src={logo} alt="" /> : <span className="logo-mark">+</span>}<span>{clinicInfo.clinic_title || 'NOSH'}<small>WELLNESS CLINIC</small></span></a>
      <div><p>{address}</p><a href={`mailto:${email}`}>{email}</a></div>
      {!compact && <div className="footer-phone"><a href={`tel:${phone}`}>{phone}</a><span>Emergency: {emergencyPhone}</span></div>}
    </footer>
  )
}
