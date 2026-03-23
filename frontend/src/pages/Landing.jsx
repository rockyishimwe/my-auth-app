import { useState } from 'react'
import { useAuth } from '../App'
import Login from './Login'
import Register from './Register'
import styles from './Landing.module.css'

export default function Landing() {
  const { login } = useAuth()
  const [currentView, setCurrentView] = useState('landing') // landing, login, register

  const handleAuthSuccess = (userData) => {
    login(userData)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onSwitch={() => setCurrentView('register')} />
      case 'register':
        return <Register onSwitch={() => setCurrentView('login')} />
      default:
        return (
          <div className={styles.landingContainer}>
            <header className={styles.header}>
              <div className={styles.brand}>
                <span className={styles.wordmark}>GOALS</span>
                <span className={styles.tag}>v1.0</span>
              </div>
              <nav className={styles.nav}>
                <button className="secondary" onClick={() => setCurrentView('login')}>
                  Sign In
                </button>
                <button onClick={() => setCurrentView('register')}>
                  Register
                </button>
              </nav>
            </header>

            <main className={styles.main}>
              <section className={styles.hero}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>
                    Achieve Your Goals
                  </h1>
                  <p className={styles.heroSubtitle}>
                    A simple, minimalist goal tracking application to help you stay focused and accomplish what matters most.
                  </p>
                  <div className={styles.heroActions}>
                    <button 
                      className={styles.primaryBtn}
                      onClick={() => setCurrentView('register')}
                    >
                      Get Started
                    </button>
                    <button 
                      className="secondary"
                      onClick={() => setCurrentView('login')}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </section>

              <section className={styles.features}>
                <div className={styles.featuresContainer}>
                  <h2 className={styles.sectionTitle}>Features</h2>
                  <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                      <div className={styles.featureIcon}>📝</div>
                      <h3 className={styles.featureTitle}>Simple Goal Tracking</h3>
                      <p className={styles.featureDescription}>
                        Add, edit, and delete your goals with a clean, minimalist interface.
                      </p>
                    </div>
                    <div className={styles.featureCard}>
                      <div className={styles.featureIcon}>🎯</div>
                      <h3 className={styles.featureTitle}>Stay Focused</h3>
                      <p className={styles.featureDescription}>
                        Remove distractions and focus on what truly matters to you.
                      </p>
                    </div>
                    <div className={styles.featureCard}>
                      <div className={styles.featureIcon}>📊</div>
                      <h3 className={styles.featureTitle}>Track Progress</h3>
                      <p className={styles.featureDescription}>
                        Monitor your achievements and see how far you've come.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.about}>
                <div className={styles.aboutContainer}>
                  <h2 className={styles.sectionTitle}>About GOALS</h2>
                  <div className={styles.aboutContent}>
                    <p className={styles.aboutText}>
                      GOALS is a minimalist goal tracking application built with the MERN stack. 
                      We believe in simplicity and focus, removing unnecessary features to help you 
                      concentrate on what's important - achieving your goals.
                    </p>
                    <div className={styles.techStack}>
                      <h3 className={styles.techTitle}>Built With</h3>
                      <div className={styles.techList}>
                        <span className={styles.techItem}>MongoDB</span>
                        <span className={styles.techItem}>Express</span>
                        <span className={styles.techItem}>React</span>
                        <span className={styles.techItem}>Node.js</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <footer className={styles.footer}>
              <div className={styles.footerContent}>
                <p className={styles.footerText}>
                  © 2024 GOALS. Built with ❤️ using MERN stack.
                </p>
                <div className={styles.footerLinks}>
                  <a href="#" className={styles.footerLink}>About</a>
                  <a href="#" className={styles.footerLink}>Privacy</a>
                  <a href="#" className={styles.footerLink}>Terms</a>
                </div>
              </div>
            </footer>
          </div>
        )
    }
  }

  return renderContent()
}
