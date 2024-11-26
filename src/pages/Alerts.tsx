import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { AlertLogs } from "@/components/Dashboard/AlertLogs";
import { WaterLevelData } from "@/lib/types";

interface AlertLog {
  timestamp: string;
  status: WaterLevelData['status'];
  message: string;
}

const Alerts = () => {
  const [logs, setLogs] = useState<AlertLog[]>(() => {
    const savedLogs = localStorage.getItem('alertLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedLogs = localStorage.getItem('alertLogs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Alert History</h1>
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-600 mb-4">
              View the history of all water level alerts. Alerts are generated when water levels reach warning or danger thresholds.
            </p>
            <AlertLogs logs={logs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Alerts;