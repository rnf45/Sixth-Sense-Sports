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

  // IA avanzada
  const [tipoApuesta, setTipoApuesta] = useState('moneyline');
  const [minProbabilidad, setMinProbabilidad] = useState(0.0);
  const [topN, setTopN] = useState(3);
  const [recomendaciones, setRecomendaciones] = useState([]);
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

  const consultarRecomendacion = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoApuesta,
          min_probabilidad: parseFloat(minProbabilidad),
          top_n: parseInt(topN),
          juegos: mockGames.map((g) => ({
            equipoA: g.team1,
            equipoB: g.team2,
            probA: g.probA ?? 0.5,
            probB: g.probB ?? 0.5,
            spread: g.spread,
            total: g.total
          }))
        })
      });

      if (!response.ok) throw new Error('Error al consultar la IA');
      const data = await response.json();
      setRecomendaciones(data.recomendaciones);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="betsense-page">
      <div className="betsense-main">
        {/* Carrusel */}
        <div className="carousel-outer">
          <button className="carousel-arrow left" onClick={() => scrollCarousel('left')}>&lt;</button>
          <div className="carousel-wrapper">
            <div className="carousel-container" ref={carouselRef}>
              <div className="carousel-track">
                {mockGames.map((game) => (
                  <div
                    key={game.id}
                    className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
                    onClick={() => setSelectedGame(game)}
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

        {/* IA Avanzada */}
        <div className="ia-section">
          <h2>Recomendación de IA</h2>

          <label>Tipo de apuesta:</label>
          <select value={tipoApuesta} onChange={(e) => setTipoApuesta(e.target.value)}>
            <option value="moneyline">Ganador Directo (Moneyline)</option>
            <option value="spread">Spread</option>
            <option value="total">Total (Over/Under)</option>
            <option value="arriesgada">Apuesta Arriesgada</option>
          </select>

          <div style={{ marginTop: '1rem' }}>
            <label>Probabilidad mínima (%): </label>
            <input
              type="number"
              value={minProbabilidad}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => setMinProbabilidad(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>¿Cuántas recomendaciones? </label>
            <input
              type="number"
              value={topN}
              min="1"
              max="10"
              onChange={(e) => setTopN(e.target.value)}
            />
          </div>

          <br />
          <button onClick={consultarRecomendacion} disabled={cargando}>
            {cargando ? 'Consultando...' : '📊 Obtener recomendaciones'}
          </button>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {recomendaciones.length > 0 && (
            <div className="ia-result">
              <h3>Resultados IA</h3>
              {recomendaciones.map((rec, index) => (
                <div key={index} className="ia-card">
                  <p><strong>Juego:</strong> {rec.juego.equipoA} vs {rec.juego.equipoB}</p>
                  <p><strong>Explicación:</strong> {rec.explicacion}</p>
                  <p><strong>Puntaje:</strong> {rec.puntaje.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetSense;
