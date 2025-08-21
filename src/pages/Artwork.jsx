import React, { useState } from 'react';

export default function Artwork() {
  const [artworks] = useState([
    {
      id: 1,
      title: 'Layers',
      artist: 'Community Collective',
      description: 'A collaborative piece created during our first community art workshop. Each participant added their own layer, representing their unique story while contributing to the whole.',
      image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=600',
      medium: 'Mixed Media',
      year: '----',
      story: 'This piece .'
    },
    {
      id: 2,
      title: 'Parallel Narratives',
      artist: 'John doe and jane doe.',
      description: 'A visual storytelling piece that maps the parallel journeys of two community members who discovered their paths were more similar than different.',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      medium: 'Digital Art',
      year: '----',
      story: 'Created after a storytelling circle where............. realized their experiences of starting over in new cities had remarkable parallels. This piece visualizes those connections.'
    },
    {
      id: 3,
      title: 'The Bridge',
      artist: '.',
      description: '........',
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=600',
      medium: 'Acrylic on Canvas',
      year: '20--',
      story: '.'
    },
  ]);

  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <div className="content-section">
      <h1>Community Artwork</h1>
      
      <div className="card">
        <p>
          Art is one of our core bridges for connection. These pieces represent the creative layers 
          that emerge when people come together with authentic intention. Each artwork tells a story 
          of collaboration, discovery, and the beautiful complexity of human experience.
        </p>
        <p>
          <strong>Living Gallery:</strong> This collection grows as our community creates. Every piece 
          represents not just artistic expression, but the relationships and insights that sparked it.
        </p>
      </div>

      {/* Artwork Gallery */}
      <div className="artwork-gallery">
        {artworks.map(artwork => (
          <div 
            key={artwork.id} 
            className="artwork-card"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <div className="artwork-image">
              <img src={artwork.image} alt={artwork.title} />
              <div className="artwork-overlay">
                <span className="view-details">View Details</span>
              </div>
            </div>
            <div className="artwork-info">
              <h3>{artwork.title}</h3>
              <p className="artwork-artist">by {artwork.artist}</p>
              <p className="artwork-medium">{artwork.medium} • {artwork.year}</p>
              <p className="artwork-description">{artwork.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="modal-overlay" onClick={() => setSelectedArtwork(null)}>
          <div className="modal artwork-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-btn"
              onClick={() => setSelectedArtwork(null)}
            >
              ×
            </button>
            <div className="artwork-detail">
              <div className="artwork-detail-image">
                <img src={selectedArtwork.image} alt={selectedArtwork.title} />
              </div>
              <div className="artwork-detail-info">
                <h2>{selectedArtwork.title}</h2>
                <p className="detail-artist">by {selectedArtwork.artist}</p>
                <p className="detail-medium">{selectedArtwork.medium} • {selectedArtwork.year}</p>
                <p className="detail-description">{selectedArtwork.description}</p>
                <div className="artwork-story">
                  <h4>The Story Behind the Art</h4>
                  <p>{selectedArtwork.story}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Creativity as Connection</h3>
        <p>
          Every piece in our gallery represents the principle that creativity serves as a bridge 
          between people. Whether created individually or collaboratively, these artworks emerged 
          from the connections and conversations within our community.
        </p>
        <p>
          <strong>Want to contribute?</strong> Join our community art workshops or share your own 
          creative layers. Art doesn't have to be perfect—it just has to be authentic.
        </p>
      </div>

      <div className="card">
        <h3>The Living Gallery Concept</h3>
        <ul>
          <li><strong>Community-Created:</strong> Every piece emerges from our gatherings and connections</li>
          <li><strong>Story-Driven:</strong> Each artwork carries the narrative of its creation</li>
          <li><strong>Collaborative Spirit:</strong> Many pieces involve multiple community members</li>
          <li><strong>Accessible Art:</strong> We believe creativity belongs to everyone, not just "artists"</li>
          <li><strong>Growing Collection:</strong> New layers are added as our community creates together</li>
        </ul>
      </div>
    </div>
  );
}