"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [platformsCount, setPlatformsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroPhotoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          setIsScrolled(scrollY > 50);
          
          const progress = docHeight > 0 ? scrollY / docHeight : 0;
          setScrollProgress(progress);

          if (heroImageRef.current && scrollY < 1200) {
            const scale = 1 + Math.min(scrollY * 0.0002, 0.06);
            const translateY = Math.min(scrollY * 0.1, 30);
            heroImageRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              
              if (entry.target.classList.contains("platforms-intro")) {
                let startTimestamp: number | null = null;
                const duration = 1200;
                const target = 5;

                const step = (timestamp: number) => {
                  if (!startTimestamp) startTimestamp = timestamp;
                  const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                  const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                  setPlatformsCount(Math.floor(easeOutProgress * target));
                  
                  if (progress < 1) {
                    window.requestAnimationFrame(step);
                  }
                };
                window.requestAnimationFrame(step);
              }
              
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
      );

      document.querySelectorAll(".reveal, .platforms-item, .platforms-intro, .contact-methods").forEach((item) => {
        observer.observe(item);
      });
    } else {
      document.querySelectorAll(".reveal, .platforms-item, .contact-methods").forEach((item) => {
        item.classList.add("is-visible");
      });
      setPlatformsCount(5);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroPhotoWrapperRef.current || window.matchMedia("(hover: none)").matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxTilt = 2; 
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    heroPhotoWrapperRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!heroPhotoWrapperRef.current) return;
    heroPhotoWrapperRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  const handleCopy = (text: string, label: string) => {
    if (!navigator.clipboard) return;
    
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${label} скопирован${label === 'Почта' ? 'а' : ''}`);
      setTimeout(() => setToastMessage(""), 2500);
    });
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      
      <header className={`header ${isScrolled ? "is-scrolled" : ""}`} id="top">
        <div 
          className="scroll-progress" 
          style={{ transform: `scaleX(${scrollProgress})` }}
        ></div>

        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="На главную — Ирина Александровна Малько">
            <span className="brand-symbol" aria-hidden="true">ИМ</span>
            <span className="brand-text"><span className="brand-name">Ирина Малько</span></span>
          </a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#about">О руководителе</a>
            <a href="#platforms">Подразделения</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
        </div>
        <nav className={`mobile-nav ${isMenuOpen ? "open" : ""}`} id="mobile-menu" aria-label="Меню для мобильных устройств">
          <a href="#about" onClick={() => setIsMenuOpen(false)}>О руководителе</a>
          <a href="#platforms" onClick={() => setIsMenuOpen(false)}>Подразделения</a>
          <a href="#contacts" onClick={() => setIsMenuOpen(false)}>Контакты</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div>
                <div className="kicker">
                  <span className="kicker-line"></span>Руководитель в сфере образования
                </div>
                <h1 className="hero-name" id="hero-title">
                  <span className="first">Ирина</span>
                  <span className="middle">Александровна</span>
                  <span className="last">Малько</span>
                </h1>
                <p className="hero-role">
                  <strong>Директор</strong> ГБУ ДО ЛО «Центр образования «Приоритет»
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#contacts">
                    Связаться{" "}
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a className="button button-outline" href="/IrinaMalko/assets/irina-malko.vcf" download="Ирина_Малько.vcf">
                    Сохранить контакт{" "}
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 3v14m-5-5 5 5 5-5M4 20h16" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="hero-bottom">
                Липецкая область <span className="dot"></span> Дополнительное образование
              </div>
            </div>
            
            <div 
              className="hero-photo"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="hero-photo-wrapper" ref={heroPhotoWrapperRef}>
                <img
                  ref={heroImageRef}
                  src="/IrinaMalko/assets/irina-malko.webp"
                  alt="Ирина Александровна Малько на официальном мероприятии"
                  width="1280"
                  height="1920"
                  fetchPriority="high"
                  style={{ transform: 'scale(1) translateY(0px)' }}
                />
              </div>
              <div className="photo-index">01 / ЛИЧНОСТЬ</div>
              <div className="photo-annotation">
                <div>
                  <span className="annotation-label">ГБУ ДО ЛО</span>
                  <span className="annotation-title">
                    Центр образования<br />«Приоритет»
                  </span>
                </div>
                <div className="annotation-marker" aria-hidden="true">И.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <span className="section-wm" aria-hidden="true">01</span>
          <div className="container">
            <div className="section-topline">
              <span className="section-number">01 / О РУКОВОДИТЕЛЕ</span>
              <span className="section-label">Профессиональная деятельность</span>
            </div>
            <div className="about-layout">
              <h2 className="section-heading reveal" id="about-title">
                Образование.<br /><em>Развитие.</em><br />Возможности.
              </h2>
              <div className="about-text reveal">
                <p className="about-lead">
                  Ирина Александровна Малько руководит Центром образования «Приоритет» Липецкой области.
                </p>
                <p className="about-detail">
                  Центр работает в сфере дополнительного образования и объединяет все направления развития детей и молодёжи. В его состав входят: Центр цифрового образования детей «IT-куб», Региональный ресурсный центр по профилактике детского дорожно-транспортного травматизма, Региональный ресурсный центр по сопровождению проекта «Навигаторы детства», Спортивно-туристский центр и Эколого-биологический центр «ЭкоМир».
                </p>
                <div className="about-tags">
                  <span>Дополнительное образование</span>
                  <span>Развитие детей и молодёжи</span>
                  <span>Образовательные проекты</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section platforms-section" id="platforms" aria-labelledby="platforms-title">
          <span className="section-wm" aria-hidden="true">02</span>
          <div className="container">
            <div className="section-topline">
              <span className="section-number">02 / СТРУКТУРНЫЕ ПОДРАЗДЕЛЕНИЯ</span>
              <span className="section-label">Адреса образовательных площадок</span>
            </div>
            
            <div className="platforms-intro reveal">
              <h2 className="section-heading" id="platforms-title">
                Образовательные<br />площадки
              </h2>
              <div>
                <p className="platforms-description">
                  В состав Центра образования «Приоритет» входят пять структурных подразделений, работающих по разным направлениям дополнительного образования.
                </p>
                <div className="platforms-counter">
                  <strong>{String(platformsCount).padStart(2, '0')}</strong>
                  <span>Подразделений</span>
                </div>
              </div>
            </div>

            <ol className="platforms-list" aria-label="Структурные подразделения учреждения">
              <li className="platforms-item">
                <span className="platforms-num">01</span>
                <h3 className="platforms-name">Центр цифрового образования детей «IT-куб»</h3>
                <div className="platforms-location">
                  <span className="platforms-location-label">Адрес</span>
                  <address className="platforms-address">Россия, Липецкая область, г. Липецк, ул. 9 Мая, дом 20</address>
                </div>
              </li>
              <li className="platforms-item">
                <span className="platforms-num">02</span>
                <h3 className="platforms-name">Региональный ресурсный центр по профилактике детского дорожно-транспортного травматизма</h3>
                <div className="platforms-location">
                  <span className="platforms-location-label">Адрес</span>
                  <address className="platforms-address">Россия, Липецкая область, г. Липецк, ул. 9 Мая, дом 20</address>
                </div>
              </li>
              <li className="platforms-item">
                <span className="platforms-num">03</span>
                <h3 className="platforms-name">Региональный ресурсный центр по сопровождению проекта «Навигаторы детства»</h3>
                <div className="platforms-location">
                  <span className="platforms-location-label">Адрес</span>
                  <address className="platforms-address">Россия, Липецкая область, г. Липецк, ул. 9 Мая, дом 20</address>
                </div>
              </li>
              <li className="platforms-item">
                <span className="platforms-num">04</span>
                <h3 className="platforms-name">Спортивно-туристский центр</h3>
                <div className="platforms-location">
                  <span className="platforms-location-label">Адрес</span>
                  <address className="platforms-address">Россия, Липецкая область, г. Липецк,<br />ул. Краснознаменная, владение 4</address>
                </div>
              </li>
              <li className="platforms-item">
                <span className="platforms-num">05</span>
                <h3 className="platforms-name">Эколого-биологический центр «ЭкоМир»</h3>
                <div className="platforms-location">
                  <span className="platforms-location-label">Адрес</span>
                  <address className="platforms-address">Россия, Липецкая область, г. Липецк, ул. Юных Натуралистов, дом 12</address>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="contact-section" id="contacts" aria-labelledby="contacts-title">
          <span className="section-wm" aria-hidden="true">03</span>
          <div className="container contacts-inner">
            <div className="section-topline">
              <span className="section-number">03 / КОНТАКТЫ</span>
              <span className="section-label">Для связи по рабочим вопросам</span>
            </div>
            <div className="contact-layout">
              <div className="reveal">
                <h2 className="contact-heading" id="contacts-title">
                  Давайте<br />будем <em>на связи.</em>
                </h2>
                <p className="contact-note">
                  Связаться с Ириной Александровной можно по телефону, электронной почте или через личную страницу ВКонтакте.
                </p>
              </div>
              <div className="contact-methods">
                <div className="contact-item">
                  <div>
                    <span className="contact-label">Телефон</span>
                    <a className="contact-value" href="tel:+79103516001">+7 (910) 351-60-01</a>
                  </div>
                  <button className="contact-action" type="button" onClick={() => handleCopy('+79103516001', 'Телефон')} aria-label="Скопировать телефон">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
                <div className="contact-item">
                  <div>
                    <span className="contact-label">Электронная почта</span>
                    <a className="contact-value" href="mailto:irina.malko@it-cube48.ru">irina.malko@it-cube48.ru</a>
                  </div>
                  <button className="contact-action" type="button" onClick={() => handleCopy('irina.malko@it-cube48.ru', 'Почта')} aria-label="Скопировать почту">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
                <div className="contact-item">
                  <div>
                    <span className="contact-label">Личная страница</span>
                    <a className="contact-value" href="https://vk.ru/id26950968" target="_blank" rel="noopener noreferrer">ВКонтакте</a>
                  </div>
                  <a className="contact-action" href="https://vk.ru/id26950968" target="_blank" rel="noopener noreferrer" aria-label="Перейти на страницу Ирины Малько ВКонтакте">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-links" aria-label="Официальные ссылки">
          <span className="footer-links-label">Официальные ссылки</span>
          <div className="footer-link-list">
            <a href="https://prioritet-48.ru/" target="_blank" rel="noopener noreferrer">Сайт «Приоритета»</a>
            <a href="https://vk.ru/prioritet48" target="_blank" rel="noopener noreferrer">«Приоритет» ВКонтакте</a>
            <a href="https://it-cube48.ru/" target="_blank" rel="noopener noreferrer">Сайт «IT-Куба»</a>
            <a href="https://vk.ru/itcube48" target="_blank" rel="noopener noreferrer">«IT-Куб» ВКонтакте</a>
          </div>
        </div>
        <div className="container footer-inner">
          <div>
            <div className="footer-person">Малько Ирина Александровна</div>
            <div className="footer-note">Директор Центра образования «Приоритет» · 2026</div>
          </div>
          <a className="backtop" href="#top">
            Наверх{" "}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </footer>

      <div className={`toast ${toastMessage ? "show" : ""}`}>
        {toastMessage}
      </div>
    </>
  );
}