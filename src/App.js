import logo from './Logo_ML.png';
import './App.scss';

import SearchComponent from './components/searchComponent/search-component';
function App() {

  return (
       <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-light d-flex flex-row justify-content-center align-middle">
            <img src={logo} alt="mercadolibrelogo" width="50" className="img-fluid"></img>
            <SearchComponent></SearchComponent>
          </nav>
        </header>
      </div>
  );
}

export default App;
    

