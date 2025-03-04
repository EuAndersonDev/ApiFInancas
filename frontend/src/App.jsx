import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Página Principal</h1>
      <Link to="/login">Ir para Login</Link>
    </div>
  );
}

export default App;