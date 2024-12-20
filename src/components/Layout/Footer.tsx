export const Footer = () => {
  return (
    <footer className="bg-primary mt-auto p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-center">
        <div className="flex flex-col md:flex-row md:space-x-8 items-center text-sm">
          <a href="#" className="hover:text-secondary transition-colors mb-2 md:mb-0">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors mb-2 md:mb-0">Terms of Service</a>
          <span>© {new Date().getFullYear()} AyceSafe. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};