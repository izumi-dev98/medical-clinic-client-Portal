import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { supabase } from '../lib/supabase'

export default function AppointmentModal({ content, open, onClose }) {
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  if (!open) return null

  async function submitAppointment(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setSending(true)
    const { error } = await supabase.from('appointments').insert({
      patient_name: formData.get('patient_name'),
      age: Number(formData.get('age')),
      address: formData.get('address'),
      phone_number: formData.get('phone_number'),
      doctor_name: formData.get('doctor_name'),
      appointment_date: formData.get('appointment_date'),
      reason: formData.get('reason'),
    })
    setSending(false)
    if (error) return
    form.reset()
    onClose()
    Swal.fire({ icon: 'success', title: 'Appointment request sent', text: 'Our care team will contact you soon.', confirmButtonColor: '#20b486' })
  }

  return <div className="appointment-backdrop" role="presentation" onClick={onClose}><section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-title" onClick={(event) => event.stopPropagation()}><button className="appointment-close" type="button" onClick={onClose} aria-label="Close appointment form">×</button><p className="section-tag"><span>Appointment request</span></p><h2 id="appointment-title">Book your visit.</h2><form className="appointment-form" onSubmit={submitAppointment}><label>Name<input name="patient_name" required /></label><label>Age<input name="age" type="number" min="0" max="130" required /></label><label>Address<input name="address" required /></label><label>Phone number<input name="phone_number" type="tel" required /></label><label>Doctor<select name="doctor_name" defaultValue=""><option value="" disabled>Select a doctor</option>{(content.doctors || []).map((doctor, index) => <option key={doctor.id || index} value={doctor.doctor_name}>{doctor.doctor_name}</option>)}</select></label><label>Appointment date<input name="appointment_date" type="date" min={new Date().toISOString().split('T')[0]} required /></label><label className="appointment-reason">Reason for visit<textarea name="reason" rows="4" required /></label><button className="solid-button" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send request'} <span aria-hidden="true">↗</span></button></form></section></div>
}
