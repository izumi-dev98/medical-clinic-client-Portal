import { useEffect, useState } from 'react'
import { supabase, storageUrl } from './lib/supabase'
import AboutPage from './components/AboutPage'
import HomePage from './components/HomePage'
import DoctorsPage from './components/DoctorsPage'
import ManagementTeamPage from './components/ManagementTeamPage'
import ServicesPage from './components/ServicesPage'
import ContentDirectoryPage from './components/ContentDirectoryPage'
import ContactPage from './components/ContactPage'
import './App.css'

function App() {
  const [content, setContent] = useState({ clinic: null, mission: [], awards: [], services: [], doctors: [], managementTeam: [], packages: [], promotions: [], blog: [], corporate: [], images: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    async function loadContent() {
      const [clinicResult, missionResult, awardsResult, servicesResult, doctorsResult, managementResult, packagesResult, promotionsResult, blogResult, corporateResult] = await Promise.all([
        supabase.from('clinic_information').select('*').limit(1).maybeSingle(),
        supabase.from('mission_vision_core').select('*').order('display_order', { ascending: true }),
        supabase.from('awards').select('*'),
        supabase.from('services').select('*').limit(6),
        supabase.from('doctors').select('*'),
        supabase.from('management_team').select('*'),
        supabase.from('medical_packages').select('*').eq('is_active', true),
        supabase.from('promotions').select('*').eq('is_active', true),
        supabase.from('blog_posts').select('*'),
        supabase.from('corporate').select('*'),
      ])
      const imageBuckets = ['clinic-images', 'mission-images', 'award-images', 'doctor-images', 'team-images', 'service-images', 'package-images', 'promotion-images', 'blog-images', 'corporate-images']
      const imageResults = await Promise.all(imageBuckets.map((bucket) => supabase.storage.from(bucket).list('', { limit: 100 })))

      const firstError = clinicResult.error || missionResult.error || awardsResult.error || servicesResult.error || doctorsResult.error || managementResult.error || packagesResult.error || promotionsResult.error || blogResult.error || corporateResult.error
      if (firstError) setError('Some clinic details could not be loaded.')
      setContent({
        clinic: clinicResult.data,
        mission: missionResult.data || [],
        awards: awardsResult.data || [],
        services: servicesResult.data || [],
        doctors: doctorsResult.data || [],
        managementTeam: managementResult.data || [],
        packages: packagesResult.data || [],
        promotions: promotionsResult.data || [],
        blog: blogResult.data || [],
        corporate: corporateResult.data || [],
        images: Object.fromEntries(imageBuckets.map((bucket, index) => [bucket, imageResults[index].data || []])),
      })
      setLoading(false)
    }

    loadContent()
  }, [])

  return page === 'about'
    ? <AboutPage content={content} loading={loading} error={error} storageUrl={storageUrl} />
    : page === 'contact'
      ? <ContactPage content={content} storageUrl={storageUrl} />
    : page === 'doctors'
      ? <DoctorsPage content={content} storageUrl={storageUrl} />
      : page === 'management'
        ? <ManagementTeamPage content={content} storageUrl={storageUrl} />
        : page === 'services'
          ? <ServicesPage content={content} storageUrl={storageUrl} />
          : page === 'packages'
            ? <ContentDirectoryPage content={content} storageUrl={storageUrl} type="packages" bucket="package-images" eyebrow="Medical packages" title={<>Care plans for <i>every need.</i></>} searchPlaceholder="Search packages" />
            : page === 'promotions'
              ? <ContentDirectoryPage content={content} storageUrl={storageUrl} type="promotions" bucket="promotion-images" eyebrow="Promotions" title={<>More care, <i>more value.</i></>} searchPlaceholder="Search promotions" />
              : page === 'blog'
                ? <ContentDirectoryPage content={content} storageUrl={storageUrl} type="blog" bucket="blog-images" eyebrow="The NOSH journal" title={<>Ideas for <i>better health.</i></>} searchPlaceholder="Search articles" />
                : page === 'corporate'
                  ? <ContentDirectoryPage content={content} storageUrl={storageUrl} type="corporate" bucket="corporate-images" eyebrow="For organisations" title={<>Healthier teams, <i>stronger futures.</i></>} searchPlaceholder="Search corporate care" />
                  : <HomePage content={content} storageUrl={storageUrl} />
}

function getPageFromHash() {
  if (window.location.hash.startsWith('#about-page')) return 'about'
  if (window.location.hash.startsWith('#contact')) return 'contact'
  if (window.location.hash.startsWith('#doctors')) return 'doctors'
  if (window.location.hash.startsWith('#management-team')) return 'management'
  if (window.location.hash.startsWith('#services')) return 'services'
  if (window.location.hash.startsWith('#medical-packages')) return 'packages'
  if (window.location.hash.startsWith('#promotions')) return 'promotions'
  if (window.location.hash.startsWith('#blog')) return 'blog'
  if (window.location.hash.startsWith('#corporate')) return 'corporate'
  return 'home'
}

export default App
