import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Personality Psychology Insights",
  description: "Explore the science of personality assessment. Learn why most personality tests fall short and how modern psychology is changing self-discovery.",
  openGraph: {
    title: "PRISM-7 Blog | Personality Psychology Insights",
    description: "Explore the science of personality assessment and self-discovery.",
  },
};

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Insights on personality psychology and self-discovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Most Personality Tests Fall Short</CardTitle>
                <CardDescription>Published on Nov 12, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  An in-depth look at the scientific criticisms of popular personality tests
                  and why dimensional assessment is more accurate.
                </p>
                <Link href="/blog/why-most-personality-tests-fall-short" className="text-sm text-primary hover:underline">
                  Read more →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-muted-foreground">Understanding the HEXACO Model</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about the scientifically validated HEXACO model and how it compares
                  to the Big Five and other personality frameworks.
                </p>
                <span className="text-sm text-muted-foreground/60">
                  Article coming soon...
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

