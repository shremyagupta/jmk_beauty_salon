import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const heroRef = React.useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = React.useRef(null);
  const touchStartX = React.useRef(null);
  const touchDeltaX = React.useRef(0);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    filterPortfolio();
  }, [activeFilter, portfolioItems]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      const apiItems = response.data || [];
      if (apiItems.length > 0) {
        setPortfolioItems(apiItems);
      } else {
        // fallback to local manifest if API returns empty
        try {
          const manifestRes = await axios.get('/portfolio-manifest.json');
          const manifest = manifestRes.data || [];
          setPortfolioItems(manifest.map((m, idx) => ({ ...m, _id: m._id || `local-${idx}` })));
        } catch (err) {
          setPortfolioItems(getDefaultPortfolio());
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      try {
        const manifestRes = await axios.get('/portfolio-manifest.json');
        const manifest = manifestRes.data || [];
        setPortfolioItems(manifest.map((m, idx) => ({ ...m, _id: m._id || `local-${idx}` })));
      } catch (err) {
        setPortfolioItems(getDefaultPortfolio());
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPortfolio = () => [
    { _id: '1', title: 'Bridal Makeup', description: 'Traditional South Asian bridal look with gold jewelry', category: 'makeup' },
    { _id: '2', title: 'Bridal Makeup', description: 'Elegant bridal makeup for special day', category: 'makeup' },
    { _id: '3', title: 'Hair Tutorial', description: 'Professional hair styling tutorial', category: 'hair' },
    { _id: '4', title: 'Hair Styling', description: 'Beautiful hair transformation', category: 'hair' },
    { _id: '5', title: 'Mehndi Design', description: 'Intricate mehndi patterns for hands', category: 'mehndi' },
    { _id: '6', title: 'Mehndi Art', description: 'Traditional mehndi design for brides', category: 'mehndi' },
    { _id: '7', title: 'Skincare Treatment', description: 'Professional skincare routine', category: 'skincare' },
    { _id: '8', title: 'Makeup Artist Work', description: 'Professional makeup artistry', category: 'makeup' },
    { _id: '9', title: 'Model Makeup', description: 'Editorial and model makeup looks', category: 'makeup' },
    { _id: '10', title: 'Hair Tutorial', description: 'Step-by-step hair styling guide', category: 'hair' },
    { _id: '11', title: 'Bridal Look', description: 'Complete bridal transformation', category: 'makeup' },
    { _id: '12', title: 'Skincare Routine', description: 'Daily skincare beauty routine', category: 'skincare' }
  ];

  const filterPortfolio = () => {
    if (activeFilter === 'all') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === activeFilter));
    }
  };

  // derive featured items from portfolioItems
  useEffect(() => {
    const featured = portfolioItems.filter(i => i.featured).slice(0, 5);
    setFeaturedItems(featured.length ? featured : portfolioItems.slice(0, 3));
  }, [portfolioItems]);

  useEffect(() => {
    // ensure hero index is within bounds when featuredItems change
    if (heroIndex >= featuredItems.length && featuredItems.length > 0) {
      setHeroIndex(0);
    }
  }, [featuredItems]);

  const scrollToHero = (index) => {
    const track = heroRef.current;
    if (!track) return;
    const child = track.children[index];
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft - 12, behavior: 'smooth' });
  };

  const nextHero = () => {
    setHeroIndex((s) => {
      const next = (s + 1) % Math.max(1, featuredItems.length);
      scrollToHero(next);
      return next;
    });
  };

  const prevHero = () => {
    setHeroIndex((s) => {
      const next = (s - 1 + Math.max(1, featuredItems.length)) % Math.max(1, featuredItems.length);
      scrollToHero(next);
      return next;
    });
  };

  useEffect(() => {
    // autoplay (paused while lightbox is open)
    if (!featuredItems.length || lightboxOpen) return;
    heroTimerRef.current = setInterval(() => {
      nextHero();
    }, 4000);
    return () => clearInterval(heroTimerRef.current);
  }, [featuredItems, lightboxOpen]);


  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const openLightbox = (item) => {
    setCurrentImage(item);
    setLightboxOpen(true);
    setExpandedId(item._id);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    setExpandedId(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction) => {
    // Defensive guards: ensure currentImage exists and there are filtered items
    if (!currentImage || !filteredItems || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex(item => item._id === currentImage._id);
    // If currentImage isn't found in the current filtered list, fallback to index 0
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    let newIndex;

    if (direction === 'next') {
      newIndex = (safeIndex + 1) % filteredItems.length;
    } else {
      newIndex = (safeIndex - 1 + filteredItems.length) % filteredItems.length;
    }

    setCurrentImage(filteredItems[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') return closeLightbox();
      // Only navigate when we have a current image and items
      if (!currentImage || !filteredItems || filteredItems.length === 0) return;
      if (e.key === 'ArrowRight') return navigateImage('next');
      if (e.key === 'ArrowLeft') return navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImage, filteredItems]);

  if (loading) {
    return (
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Portfolio</h2>
            <p className="section-subtitle">Loading portfolio...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Portfolio</h2>
            <p className="section-subtitle">Showcasing our beautiful transformations</p>
          </div>
          {/* Featured hero carousel */}
          {featuredItems && featuredItems.length > 0 && (
            <div
              className="portfolio-hero"
              onMouseEnter={() => clearInterval(heroTimerRef.current)}
              onMouseLeave={() => { clearInterval(heroTimerRef.current); if (!lightboxOpen) heroTimerRef.current = setInterval(nextHero, 4000); }}
              onTouchStart={(e) => {
                clearInterval(heroTimerRef.current);
                touchStartX.current = e.touches && e.touches[0] ? e.touches[0].clientX : null;
                touchDeltaX.current = 0;
              }}
              onTouchMove={(e) => {
                if (!touchStartX.current) return;
                const x = e.touches && e.touches[0] ? e.touches[0].clientX : 0;
                touchDeltaX.current = x - touchStartX.current;
              }}
              onTouchEnd={() => {
                const delta = touchDeltaX.current || 0;
                const threshold = 50; // px to consider swipe
                if (delta > threshold) {
                  prevHero();
                } else if (delta < -threshold) {
                  nextHero();
                }
                touchStartX.current = null;
                touchDeltaX.current = 0;
                if (!lightboxOpen) {
                  clearInterval(heroTimerRef.current);
                  heroTimerRef.current = setInterval(nextHero, 4000);
                }
              }}
            >
              <button className="hero-prev" onClick={prevHero} aria-label="Previous">&#10094;</button>
              <div className="hero-track" ref={heroRef}>
                {featuredItems.map((it, idx) => (
                  <div key={it._id} className={`hero-card ${idx === heroIndex ? 'active' : ''}`} onClick={() => openLightbox(it)}>
                    {it.type === 'video' ? (
                      <video src={it.videoUrl} muted loop playsInline className="hero-media" poster={it.posterUrl || it.thumbUrl} />
                    ) : (
                      <img src={it.imageUrl} alt={it.title} className="hero-media" />
                    )}
                    <div className="hero-badge">Featured</div>
                    <div className="hero-caption">
                      <h3>{it.title}</h3>
                      <p>{it.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="hero-next" onClick={nextHero} aria-label="Next">&#10095;</button>
              <div className="hero-indicators">
                {featuredItems.map((_, i) => (
                  <button key={i} className={`hero-dot ${i === heroIndex ? 'active' : ''}`} onClick={() => { setHeroIndex(i); scrollToHero(i); }} aria-label={`Go to slide ${i+1}`}></button>
                ))}
              </div>
            </div>
          )}

          <div className="portfolio-filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'makeup' ? 'active' : ''}`}
              onClick={() => handleFilterClick('makeup')}
            >
              Bridal Makeup
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'hair' ? 'active' : ''}`}
              onClick={() => handleFilterClick('hair')}
            >
              Hair Tutorial
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'mehndi' ? 'active' : ''}`}
              onClick={() => handleFilterClick('mehndi')}
            >
              Mehndi Design
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'skincare' ? 'active' : ''}`}
              onClick={() => handleFilterClick('skincare')}
            >
              Skincare
            </button>
          </div>
          {/* Grouped by category sections for better organization */}
          <div className="portfolio-sections">
            {Object.entries(filteredItems.reduce((acc, item) => {
                acc[item.category] = acc[item.category] || [];
                acc[item.category].push(item);
                return acc;
              }, {})).map(([category, items]) => (
                <section key={category} className="portfolio-category">
                  <div className="category-header">
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  </div>
                  <div className="portfolio-grid">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className={`portfolio-item ${expandedId === item._id ? 'expanded' : ''}`}
                        onClick={() => openLightbox(item)}
                      >
                        <div className="portfolio-image">
                          {item.type === 'video' ? (
                            <video
                              className="portfolio-img"
                              src={item.videoUrl}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              poster={item.posterUrl || item.thumbUrl}
                            />
                          ) : item.imageUrl ? (
                            <picture>
                              {item.webpSrcSet ? (
                                <source
                                  type="image/webp"
                                  srcSet={item.webpSrcSet}
                                  sizes="(max-width:600px) 100vw, (max-width:968px) 50vw, 33vw"
                                />
                              ) : null}
                              <img
                                src={item.imageUrl}
                                srcSet={item.srcSet || undefined}
                                sizes="(max-width:600px) 100vw, (max-width:968px) 50vw, 33vw"
                                alt={item.title}
                                className="portfolio-img"
                                loading="lazy"
                                onError={(e) => {
                                  try {
                                    if (e && e.target && e.target.style) e.target.style.display = 'none';
                                    const parent = e.target && e.target.closest ? e.target.closest('.portfolio-image') : null;
                                    if (parent) {
                                      const placeholder = parent.querySelector('.image-placeholder');
                                      if (placeholder && placeholder.style) placeholder.style.display = 'flex';
                                    }
                                  } catch (err) {
                                    console.error('image onError handler failed', err);
                                  }
                                }}
                              />
                            </picture>
                          ) : null}
                          <div
                            className="image-placeholder portfolio-img"
                            style={{ display: item.imageUrl || item.type === 'video' ? 'none' : 'flex' }}
                          >
                            <span>{item.title}</span>
                          </div>
                          <div className="portfolio-overlay">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && currentImage && (
        <div className="lightbox active" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-close" onClick={closeLightbox}>&times;</span>
            <button 
              className="lightbox-prev" 
              onClick={() => navigateImage('prev')}
            >
              &#10094;
            </button>
            <button 
              className="lightbox-next" 
              onClick={() => navigateImage('next')}
            >
              &#10095;
            </button>
            <div className="lightbox-image-container">
              <div className="lightbox-image">
                {currentImage.type === 'video' ? (
                  <video controls style={{ width: '100%', height: 'auto', maxHeight: '75vh' }}>
                    <source src={currentImage.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : currentImage.imageUrl ? (
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.title}
                    style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
                    onError={(e) => {
                      try {
                        if (e && e.target && e.target.style) e.target.style.display = 'none';
                        const next = e && e.target ? (e.target.nextElementSibling || e.target.nextSibling) : null;
                        if (next && next.style) next.style.display = 'flex';
                      } catch (err) {
                        console.error('lightbox image onError', err);
                      }
                    }}
                  />
                ) : null}
                <div
                  className="image-placeholder portfolio-img"
                  style={{ display: currentImage.imageUrl || currentImage.type === 'video' ? 'none' : 'flex' }}
                >
                  <span>{currentImage.title}</span>
                </div>
              </div>
              <div className="lightbox-caption">
                <h4>{currentImage.title}</h4>
                <p>{currentImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;

