import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By using Authentic Self, you agree to these terms of service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Use of Service</h2>
              <p className="text-muted-foreground">
                You may use our service for personal or professional purposes in accordance with
                these terms.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content and methodology are protected by copyright and intellectual property laws.
              </p>
            </section>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

