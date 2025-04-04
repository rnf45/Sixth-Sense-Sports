import React, {useEffect} from 'react';
import { Link } from 'react-router-dom'; 
import "../styles/Home.css";
import robot from '/assets/banner-img.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,   
      once: true        
    });
  }, []);

  return (
    <div className='homepage'>
      <div className='banner' data-aos='zoom-in'>
        <div className='banner-left'>
          <h1>Welcome to Sixth Sense Sports</h1>
          <p>
          Tap into your sixth sense and unlock smarter betting decisions with AI-powered NFL parlay analysis. 
          Build your custom parlay or explore weekly stats and predictions to get the edge you’ve been looking for.      </p>
          <Link to="/betsense" className="oracle-button">
            Launch BetSense
          </Link>
        </div>
        <div className="banner-right">
          <img src={robot}/>
        </div>
      </div>
    </div>
  )
}

export default Home
