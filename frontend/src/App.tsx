import React from 'react';
import './App.scss';
import AppCard from './AppCard';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App__container App__container--app-card">
        <AppCard />
      </div>
      <div className="App__container App__container--footer">
        <Footer />
      </div>
    </div>
  );
};

export default App;
