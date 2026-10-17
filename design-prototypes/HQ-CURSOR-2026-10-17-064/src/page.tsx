import { createRoot } from "react-dom/client";
import { SmartphoneLifecycleGuide } from "@/components/smartphone-lifecycle";
import { CandidateLifecycleGuide } from "./CandidateGuide";
import "./harness.css";

const variant = document.documentElement.dataset.variant;
const GUIDE_TARGET_ID = "lifecycle-guide-heading";

function Page() {
  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs text-muted-foreground" data-harness-banner="">
        Design prototype harness ({variant}). Not the production page; guide section only.
      </p>
      {variant === "candidate" ? (
        <CandidateLifecycleGuide headingId={GUIDE_TARGET_ID} />
      ) : (
        <SmartphoneLifecycleGuide headingId={GUIDE_TARGET_ID} />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Page />);
