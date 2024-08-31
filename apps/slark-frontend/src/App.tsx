import Todo from './pages/Todo'
import { enablePatches } from "immer";
import './App.css';

enablePatches();

function App() {
  return <Todo />
}

export default App;
