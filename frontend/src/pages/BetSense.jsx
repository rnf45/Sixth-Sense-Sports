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

  // IA states
  const [mejorApuesta, setMejorApuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

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

  const consultarIA = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/mejor-apuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockGames.map((g) => ({
          equipoA: g.team1,
          equipoB: g.team2,
          probA: g.probA ?? 0.5,
          probB: g.probB ?? 0.5
        })))
      });

      if (!response.ok) {
        throw new Error('Error al consultar la IA');
      }

      const data = await response.json();
      setMejorApuesta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
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
              <p>No prop selected yet.</p>
            </div>
          </div>
        </div>

        {/* IA Section */}
        <div className="ia-section">
          <h2>Consulta IA</h2>
          <button onClick={consultarIA} disabled={cargando}>
            {cargando ? 'Consultando...' : '📊 Calcular mejor apuesta'}
          </button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {mejorApuesta && (
            <div className="ia-result">
              <h3>Resultado IA:</h3>
              <p><strong>Ganador sugerido:</strong> {mejorApuesta.equipo_ganador}</p>
              <p><strong>Probabilidad:</strong> {mejorApuesta.probabilidad}</p>
              <p>
                <strong>Juego:</strong> {mejorApuesta.juego.equipoA} vs {mejorApuesta.juego.equipoB}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetSense;
