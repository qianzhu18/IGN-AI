import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const Footer = () => {
  const links = CONFIG.IGNAI_FOOTER_LINKS || []
  const slogan = CONFIG.IGNAI_FOOTER_SLOGAN || 'Ignite before AGI.'
  const subtitle = CONFIG.IGNAI_FOOTER_SUBTITLE || ''

  return (
    <footer className='rig-footer'>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 3rem' }}>
        <div className='rig-footer-grid'>
          <div className='rig-footer-brand'>
            <p className='rig-display' style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
              IGNAI
            </p>
            {subtitle && (
              <p style={{ marginTop: 4, color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{subtitle}</p>
            )}
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 280 }}>
              {slogan}
            </p>
            <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
              Based in Changsha, connected to the world.
            </p>
          </div>

          {links.map(group => (
            <div key={group.name} className='rig-footer-col'>
              <h3>{group.name}</h3>
              <ul>
                {group.menus.map(item => (
                  <li key={item.href || item.title}>
                    <SmartLink href={item.href}>
                      {item.title}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='rig-footer-bottom'>
          <span>&copy; {new Date().getFullYear()} IGNAI COMMUNITY. ALL RIGHTS RESERVED.</span>
          <div className='rig-footer-status'>
            <span className='rig-footer-status-dot' />
            <span>COMMUNITY ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
