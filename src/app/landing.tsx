import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-8xl font-semibold wrap-break-word">thoughtboard</h1>
        <p>microblogging for the modern age</p>
      </div>
      <div className="flex gap-2">
        <SignInButton forceRedirectUrl="/onboarding">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
        <SignUpButton forceRedirectUrl="/onboarding">
          <Button>Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
