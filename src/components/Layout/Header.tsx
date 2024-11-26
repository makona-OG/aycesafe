import { DropletIcon, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary p-4 text-white shadow-lg animate-slide-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropletIcon size={32} className="text-secondary" />
          <Link to="/" className="text-2xl font-bold">AyceSafe</Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-secondary" />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary transition-colors">Dashboard</Link>
          <Link to="/trend-analysis" className="hover:text-secondary transition-colors">Trend Analysis</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
          <Link to="/alerts" className="hover:text-secondary transition-colors">Alerts</Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-primary p-4 md:hidden flex flex-col space-y-4 shadow-lg">
            <Link to="/" className="hover:text-secondary transition-colors">Dashboard</Link>
            <Link to="/trend-analysis" className="hover:text-secondary transition-colors">Trend Analysis</Link>
            <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
            <Link to="/alerts" className="hover:text-secondary transition-colors">Alerts</Link>
          </nav>
        )}
      </div>
    </header>
  );
};