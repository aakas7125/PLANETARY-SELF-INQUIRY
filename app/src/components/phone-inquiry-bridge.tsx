import { Button } from "@/components/ui/button";

export function PhoneInquiryBridge() {
  return (
    <section
      id="phone-inquiry"
      aria-labelledby="phone-inquiry-heading"
      className="border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Phone inquiry
          </p>
          <h2
            id="phone-inquiry-heading"
            className="mt-3 font-display text-3xl leading-tight sm:text-5xl"
          >
            Follow one phone question through to your own choice
          </h2>
          <p className="mt-4 text-muted-foreground">
            It is an inquiry through situation, reflection, comparison, conditional
            pathways, otherness, and your own final choice.
          </p>
          <p id="phone-inquiry-boundary" className="mt-4 text-sm text-foreground">
            It does not recommend a purchase. It does not prove the Protect Four
            proposition. It is not a complete life-cycle assessment.
          </p>
          <Button asChild className="mt-8">
            <a
              href="/smartphone"
              aria-describedby="phone-inquiry-boundary"
              className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Begin the phone inquiry
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
