import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import './App.scss';
import Workspace from './pages/Workspace';
import XTerm from './components/XTerm';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/tabs/:tabId" element={<XTerm />} />
          <Route path="/" element={<Workspace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
