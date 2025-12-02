"use client";

import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DimensionsWheel, ProcessFlow } from "@/components/visualizations";

const faqs = [
  {
    question: "How accurate is this assessment?",
    answer: "Our assessment is based on the scientifically validated HEXACO+ model and uses modern psychometric methods including adaptive testing and multi-method assessment. All scores include confidence intervals to show measurement precision.",
  },
  {
    question: "How long does the assessment take?",
    answer: "The Quick assessment takes about 7 minutes (35 questions), while the Full assessment takes about 15 minutes (125 questions). Choose the version that works best for you.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you can take the assessment as a guest. However, creating an account allows you to save your results, track changes over time, and access additional features.",
  },
  {
    question: "How is this different from Myers-Briggs?",
    answer: "Unlike Myers-Briggs which forces personality into 16 rigid categories, we use dimensional scoring that recognizes personality traits exist on continuous scales. This provides more nuanced and accurate results.",
  },
  {
    question: "Can I retake the assessment?",
    answer: "Yes! You can retake the assessment at any time. Creating an account allows you to track how your results may change over time.",
  },
  {
    question: "Is my data private?",
    answer: "Yes, we take privacy seriously. Your assessment responses and results are stored securely and are only used to provide you with insights. You can delete your data at any time.",
  },
];

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Container className="flex-1 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Authentic Self
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual Aid - The 7 Dimensions */}
          <div className="mt-12">
            <DimensionsWheel showTitle={true} />
          </div>

          {/* How It Works */}
          <div className="mt-8">
            <ProcessFlow showTitle={true} variant="horizontal" />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

