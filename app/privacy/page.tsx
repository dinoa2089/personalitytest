import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold">Data Collection</h2>
              <p className="text-muted-foreground">
                We collect assessment responses and results to provide you with personalized insights.
                All data is stored securely and used only to deliver our services.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Data Usage</h2>
              <p className="text-muted-foreground">
                Your assessment data is used solely to generate your personality profile and provide
                insights. We do not sell your personal data to third parties.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p className="text-muted-foreground">
                We use industry-standard security measures to protect your data, including encryption
                at rest and in transit.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, export, or delete your data at any time through your
                account settings or by contacting us.
              </p>
            </section>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

