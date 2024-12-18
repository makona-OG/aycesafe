import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2pdf from 'html2pdf.js';
import { Download } from "lucide-react";

const FullDocumentation = () => {
  const handleDownloadPDF = () => {
    const element = document.getElementById('documentation-content');
    const opt = {
      margin: 1,
      filename: 'AyceSafe-Documentation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">AyceSafe Documentation</h1>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        <div id="documentation-content" className="space-y-8">
          <Tabs defaultValue="introduction" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto">
              <TabsTrigger value="introduction">Introduction</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
            </TabsList>

            <TabsContent value="introduction" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    AyceSafe is an advanced and multifaceted water monitoring platform designed to provide real-time insights into critical environmental metrics.
                  </p>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Features</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Dynamic Real-Time Monitoring</li>
                      <li>Integrated Weather Reporting</li>
                      <li>Threshold-Based Alerts</li>
                      <li>In-Depth Historical Analysis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Installation Guide</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Prerequisites</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Node.js (v16 or higher)</li>
                      <li>Python 3.x</li>
                      <li>Git</li>
                    </ul>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="whitespace-pre-wrap">
                        <code>
                          {`# Clone the repository
git clone https://github.com/makona-OG/aycesafe.git
cd aycesafe

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm">
                    <pre>
{`
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   Database   │
│  React/Vite  │────▶│    Flask    │────▶│   Storage    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                    │
       │                     │                    │
       ▼                     ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │     │   Infobip    │     │   Sensors    │
│  Interface   │     │     API      │     │    Data      │
└──────────────┘     └──────────────┘     └──────────────┘
`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Technical Components</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Frontend Stack</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Vite - Build tool and development server</li>
                      <li>React - UI library</li>
                      <li>TypeScript - Type-safe JavaScript</li>
                      <li>Tailwind CSS - Utility-first CSS framework</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="text-lg font-semibold mb-2">GET /api/data</h3>
                      <p>Fetches current sensor readings for water depth, temperature, and weather.</p>
                      <pre className="mt-2">
                        <code>
{`Response:
{
  "water_depth": number,
  "temperature": number,
  "weather": string
}`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullDocumentation;