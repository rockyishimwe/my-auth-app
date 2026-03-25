import { useAuth } from '../App'
import styles from './About.module.css'

export default function About() {
  const { user, logout, navigateTo } = useAuth()

  return (
    <div className={styles.shell + ' page-fade'}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.wordmark}>ABOUT</span>
          {user && <span className={styles.userBadge}>{user.name?.toUpperCase()}</span>}
        </div>
        {user && (
          <nav className={styles.nav}>
            <button 
              className={styles.navBtn}
              onClick={() => navigateTo('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={styles.navBtn}
              onClick={() => navigateTo('profile')}
            >
              Profile
            </button>
            <button 
              className={styles.navBtn}
              onClick={() => navigateTo('settings')}
            >
              Settings
            </button>
            <button 
              className={styles.navBtn}
              onClick={() => navigateTo('about')}
              style={{ background: '#000', color: '#fff' }}
            >
              About
            </button>
            <button 
              className="secondary" 
              onClick={logout} 
              style={{ fontSize: '0.7rem', padding: '6px 14px' }}
            >
              Sign Out
            </button>
          </nav>
        )}
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>GOALS</h1>
            <p className={styles.subtitle}>Version 1.0.0</p>
            <p className={styles.description}>
              A minimalist goal tracking application built to help you stay focused and achieve what matters most.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Philosophy</h2>
          <div className={styles.content}>
            <p className={styles.text}>
              In a world full of distractions and complex applications, we believe in simplicity. 
              GOALS was created with one purpose: to help you track and achieve your goals without 
              unnecessary features or clutter.
            </p>
            <p className={styles.text}>
              Our minimalist approach removes the noise so you can focus on what truly matters - 
              setting meaningful goals and working towards them every day.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}></div>
              <h3 className={styles.featureTitle}>Simple Goal Management</h3>
              <p className={styles.featureText}>
                Add, edit, and delete goals with a clean, intuitive interface.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}></div>
              <h3 className={styles.featureTitle}>Minimalist Design</h3>
              <p className={styles.featureText}>
                Black and white aesthetic that helps you focus on your goals.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}></div>
              <h3 className={styles.featureTitle}>Secure & Private</h3>
              <p className={styles.featureText}>
                Your data is encrypted and kept private. No tracking, no ads.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}></div>
              <h3 className={styles.featureTitle}>Fast & Responsive</h3>
              <p className={styles.featureText}>
                Built with modern web technologies for a smooth experience.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technology Stack</h2>
          <div className={styles.techStack}>
            <div className={styles.techCategory}>
              <h3 className={styles.techTitle}>Frontend</h3>
              <div className={styles.techList}>
                <span className={styles.techItem}>React</span>
                <span className={styles.techItem}>Vite</span>
                <span className={styles.techItem}>CSS Modules</span>
              </div>
            </div>
            <div className={styles.techCategory}>
              <h3 className={styles.techTitle}>Backend</h3>
              <div className={styles.techList}>
                <span className={styles.techItem}>Node.js</span>
                <span className={styles.techItem}>Express</span>
                <span className={styles.techItem}>JWT</span>
              </div>
            </div>
            <div className={styles.techCategory}>
              <h3 className={styles.techTitle}>Database</h3>
              <div className={styles.techList}>
                <span className={styles.techItem}>MongoDB</span>
                <span className={styles.techItem}>Mongoose</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Source</h2>
          <div className={styles.content}>
            <p className={styles.text}>
              GOALS is an open-source project. We believe in transparency and community collaboration. 
              You can view the source code, contribute, or report issues on our GitHub repository.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryBtn}>
                View on GitHub
              </button>
              <button className="secondary">
                Report Issue
              </button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.content}>
            <p className={styles.text}>
              Have questions, feedback, or suggestions? We would love to hear from you.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email:</span>
                <span className={styles.contactValue}>goals-at-example.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>GitHub:</span>
                <span className={styles.contactValue}><github className="com" />
                <rockyishimwe />goals-app</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Twitter:</span>
                <span className={styles.contactValue}>at-goalsapp</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              © 2025 GOALS. Built with  using the MERN stack.
            </p>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>License</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
