import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Experiences from './pages/Experiences';
import Merchandise from './pages/Merchandise';
import Artwork from './pages/Artwork';
import AnimatedBackground from './components/AnimatedBackground';

const App = () => {
  return (
    <>
      <AnimatedBackground />
      <Router>
        {/* Layout container for sidebar + main content */}
        <div className="layout-container">
          <Navbar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/merchandise" element={<Merchandise />} />
              <Route path="/artwork" element={<Artwork />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;

