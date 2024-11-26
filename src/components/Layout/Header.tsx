import { DropletIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-primary p-4 text-white shadow-lg animate-slide-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropletIcon size={32} className="text-secondary" />
          <Link to="/" className="text-2xl font-bold">AyceSafe</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary transition-colors">Dashboard</Link>
          <Link to="/trend-analysis" className="hover:text-secondary transition-colors">Trend Analysis</Link>
          <a href="#" className="hover:text-secondary transition-colors">Alerts</a>
        </nav>
      </div>
    </header>
  );
};