import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-foreground">About AyceSafe</h1>
        <p className="text-xl text-center text-muted-foreground mt-2">Real-Time Water Level Monitoring and Safety Dashboard</p>
        <hr className="my-8 border-border" />

        {/* Introduction Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground">What is AyceSafe?</h2>
          <p className="mt-4 text-foreground">
            AyceSafe is a dedicated water level monitoring application, designed to provide real-time
            updates and alerts for water level changes. With integration of LoRaWAN sensors,
            AyceSafe continuously monitors water conditions and ensures prompt notifications via SMS and email
            in case of high water levels.
          </p>
        </section>

        {/* Purpose Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground">Why AyceSafe?</h2>
          <p className="mt-4 text-foreground">
            Water level monitoring is essential for ensuring safety, especially in areas prone to flooding or
            other water-related risks. AyceSafe aims to help communities and stakeholders by offering
            accessible, timely information that empowers them to make informed decisions.
          </p>
        </section>

        {/* Features Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground">Key Features</h2>
          <ul className="mt-4 list-disc list-inside space-y-2 text-foreground">
            <li>Real-time monitoring of water levels, temperature, and weather conditions.</li>
            <li>Historical trends analysis across seasons, allowing users to track changes over time.</li>
            <li>SMS and email alert notifications for high water levels, helping ensure safety.</li>
            <li>Easy-to-use dashboard layout for quick and accessible information display.</li>
          </ul>
        </section>

        {/* Mission Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
          <p className="mt-4 text-foreground">
            At AyceSafe, our mission is to provide a robust, reliable, and user-friendly solution for
            water level monitoring, helping communities stay aware and prepared in the face of water-related
            risks.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mt-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
          <p className="mt-4 text-foreground">
            If you have any questions or need support, please feel free to{" "}
            <a href="/contact" className="text-primary hover:text-secondary underline">
              reach out to us
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;