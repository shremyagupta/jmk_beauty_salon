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

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    filterPortfolio();
  }, [activeFilter, portfolioItems]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      setPortfolioItems(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setPortfolioItems(getDefaultPortfolio());
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

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const openLightbox = (item) => {
    setCurrentImage(item);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredItems.findIndex(item => item._id === currentImage._id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    
    setCurrentImage(filteredItems[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateImage('next');
        if (e.key === 'ArrowLeft') navigateImage('prev');
      }
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
          <div className="portfolio-grid">
            {filteredItems.map((item) => (
              <div 
                key={item._id} 
                className="portfolio-item"
                onClick={() => openLightbox(item)}
              >
                <div className="portfolio-image">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="portfolio-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="image-placeholder portfolio-img"
                    style={{ display: item.imageUrl ? 'none' : 'flex' }}
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
                {currentImage.imageUrl ? (
                  <img 
                    src={currentImage.imageUrl} 
                    alt={currentImage.title}
                    style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="image-placeholder portfolio-img"
                  style={{ display: currentImage.imageUrl ? 'none' : 'flex' }}
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

