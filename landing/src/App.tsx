import Header from './sections/Header';
import Hero from './sections/Hero';
import ProductAreas from './sections/ProductAreas';
import Questions from './sections/Questions';
import Integration from './sections/Integration';
import Privacy from './sections/Privacy';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ice-50 font-sans">
      <Header />
      <main>
        <Hero />
        <ProductAreas />
        <Questions />
        <Integration />
        <Privacy />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
