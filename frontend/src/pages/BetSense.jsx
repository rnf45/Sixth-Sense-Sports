import React, { useRef, useState, useEffect } from 'react';
import '../styles/BetSense.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import mockGames from '../data/mockGames';

const BetSense = () => {
  const carouselRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPropType, setSelectedPropType] = useState(null);
  const [selectedStatType, setSelectedStatType] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  const scrollCarousel = (direction) => {
    const scrollAmount = carouselRef.current.offsetWidth;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleSelectPropType = (prop_type) => {
    setSelectedPropType(prop_type);
  };

  const handleSelectStatType = (stat_type) => {
    setSelectedStatType(stat_type);
  };

  return (
    <div className="betsense-page">
      <header className="betsense-header">
      </header>

      <div className='betsense-main'>
          <div className="carousel-outer">
            <button className="carousel-arrow left" onClick={() => scrollCarousel('left')}>&lt;</button>
            <div className="carousel-wrapper">
              <div className="carousel-container" ref={carouselRef}>
                <div className="carousel-track">
                  {mockGames.map((game) => (
                    <div
                      key={game.id}
                      className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
                      onClick={() => handleSelectGame(game)}
                    >
                      <h3>{game.team1} vs {game.team2}</h3>
                      <p><strong>Date:</strong> {game.date}</p>
                      <p><strong>Time:</strong> {game.time}</p>
                      <p><strong>Spread:</strong> {game.spread}</p>
                      <p><strong>Total:</strong> {game.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="carousel-arrow right" onClick={() => scrollCarousel('right')}>&gt;</button>
          </div>

          <div className='interactive-wrapper'>

            {/* Left: Prop Type Menu & Display */}
            <div className='props-section'>
              <div className='interactive-menu'>
                <h1>Props</h1>
                <button
                  className={`interactive-tab ${selectedPropType === 'Game' ? 'active' : ''}`}
                  onClick={() => setSelectedPropType('Game')}
                >
                  Game
                </button>

                <button
                  className={`interactive-tab ${selectedPropType === 'Players' ? 'active' : ''}`}
                  onClick={() => setSelectedPropType('Players')}
                >
                  Players
                </button>

                <button
                  className={`interactive-tab ${selectedPropType === 'Touchdown Scorers' ? 'active' : ''}`}
                  onClick={() => setSelectedPropType('Touchdown Scorers')}
                >
                  Touchdown Scorers
                </button>

              </div>

              <div className='props-display'>
                {/* List of props for selected tab */}
                <p>No prop selected yet.</p>
              </div>
            </div>

            {/* Right: Stats menu & Display */}
            <div className='stats-section'>
              <div className='interactive-menu'>
                <h1>Stats</h1>
                <button
                  className={`interactive-tab ${selectedStatType === 'Team' ? 'active' : ''}`}
                  onClick={() => setSelectedStatType('Team')}
                >
                  Team
                </button>

                <button
                  className={`interactive-tab ${selectedStatType === 'Players' ? 'active' : ''}`}
                  onClick={() => setSelectedStatType('Players')}
                >
                  Players
                </button>

                <button
                  className={`interactive-tab ${selectedStatType === 'Insights' ? 'active' : ''}`}
                  onClick={() => setSelectedStatType('Insights')}
                >
                  Insights
                </button>

              </div>

              <div className='stats-display'>
                {/* List of stats for selected tab */}
                <p>No prop selected yet.</p>
              </div>
            </div>

          </div>




      </div>
    </div>
  );
};

export default BetSense;


