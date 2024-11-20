import { DropletIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-primary p-4 text-white shadow-lg animate-slide-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropletIcon size={32} className="text-secondary" />
          <h1 className="text-2xl font-bold">AyceSafe</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-secondary transition-colors">Dashboard</a>
          <a href="#" className="hover:text-secondary transition-colors">History</a>
          <a href="#" className="hover:text-secondary transition-colors">Alerts</a>
        </nav>
      </div>
    </header>
  );
};