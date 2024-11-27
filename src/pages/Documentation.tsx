import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="prose dark:prose-invert">
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to the comprehensive documentation for our Flood Monitoring System. 
              This guide will help you understand and utilize all features of the application effectively.
            </p>
          </section>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger className="text-xl font-semibold">System Overview</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>The Flood Monitoring System is a comprehensive solution designed to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Monitor water levels in real-time</li>
                  <li>Track weather conditions affecting flood risks</li>
                  <li>Provide early warning alerts for potential flooding</li>
                  <li>Analyze historical data for better prediction</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dashboard">
              <AccordionTrigger className="text-xl font-semibold">Dashboard Features</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h4 className="font-semibold">Water Level Gauge</h4>
                <p>The water level gauge displays current water levels with three status indicators:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Safe (Green): Normal water levels</li>
                  <li>Warning (Yellow): Elevated water levels requiring attention</li>
                  <li>Danger (Red): Critical water levels requiring immediate action</li>
                </ul>

                <h4 className="font-semibold mt-4">Weather Display</h4>
                <p>Provides real-time weather information including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Current temperature</li>
                  <li>Weather conditions</li>
                  <li>Rainfall measurements</li>
                </ul>

                <h4 className="font-semibold mt-4">Location Map</h4>
                <p>Interactive map showing:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Monitoring station locations</li>
                  <li>Current water level status</li>
                  <li>Area coverage details</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="alerts">
              <AccordionTrigger className="text-xl font-semibold">Alert System</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>The alert system automatically notifies stakeholders when:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Water levels reach warning thresholds</li>
                  <li>Critical weather conditions are detected</li>
                  <li>System maintenance is required</li>
                </ul>
                <p className="mt-4">Alerts are delivered through:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SMS notifications</li>
                  <li>In-app notifications</li>
                  <li>Email updates (for registered users)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="analysis">
              <AccordionTrigger className="text-xl font-semibold">Trend Analysis</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>The trend analysis tools provide:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Historical water level data visualization</li>
                  <li>Statistical analysis of flood patterns</li>
                  <li>Seasonal trend identification</li>
                  <li>Predictive insights for future flood risks</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maintenance">
              <AccordionTrigger className="text-xl font-semibold">System Maintenance</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>Regular maintenance procedures include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sensor calibration checks</li>
                  <li>Data accuracy verification</li>
                  <li>System updates and improvements</li>
                  <li>Backup and recovery procedures</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <section className="mt-8 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Need Additional Help?</h3>
            <p className="text-muted-foreground">
              If you need further assistance or have specific questions, please don't hesitate to contact our support team
              through the Contact page or email us at support@floodmonitoring.com
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;