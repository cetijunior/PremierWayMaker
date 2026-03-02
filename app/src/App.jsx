import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Success from './pages/Success';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply/:type" element={<Apply />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
