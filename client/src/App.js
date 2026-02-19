import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const path = window.location.pathname;

  if (path.startsWith('/admin/login')) {
    return (
      <div className="App">
        <AdminLogin />
      </div>
    );
  }

  if (path.startsWith('/admin')) {
    return (
      <div className="App">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Home />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;




