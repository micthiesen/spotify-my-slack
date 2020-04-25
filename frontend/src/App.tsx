import React from 'react';
import './App.scss';
import AppCard from './AppCard';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App__container">
        <AppCard />
      </div>
      <div className="App__footer">
        <Footer />
      </div>
    </div>
  );
};

export default App;
