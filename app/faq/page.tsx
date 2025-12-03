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
    answer: "The assessment uses a checkpoint system: Checkpoint 1 (PRISM-7 Profile) takes ~8 minutes with 35 questions. You can stop there or continue: Checkpoint 2 adds MBTI (+5 min), Checkpoint 3 adds Enneagram (+6 min), and Checkpoint 4 provides deep insights (+6 min). Total: ~25 minutes for the complete experience, but you get results at each checkpoint.",
  },
  {
    question: "Can I stop and continue later?",
    answer: "Absolutely! Your progress is automatically saved. You'll receive results at each checkpoint, and you can continue to unlock more insights whenever you're ready. The checkpoint system is designed so you can complete the assessment at your own pace.",
  },
  {
    question: "What are the checkpoints?",
    answer: "Checkpoints are milestones in your assessment journey. At each checkpoint, you receive your results for that stage: Checkpoint 1 gives you your PRISM-7 profile and archetype, Checkpoint 2 adds your MBTI type, Checkpoint 3 reveals your Enneagram, and Checkpoint 4 provides comprehensive deep-dive insights.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you can take the assessment as a guest. However, creating an account allows you to save your results permanently, track changes over time, and access additional features.",
  },
  {
    question: "How is this different from Myers-Briggs?",
    answer: "Unlike Myers-Briggs which forces personality into 16 rigid categories, we use dimensional scoring that recognizes personality traits exist on continuous scales. This provides more nuanced and accurate results. Plus, we include MBTI mapping as one of our checkpoint unlocks!",
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
              Everything you need to know about the PRISM-7 Personality Assessment
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
