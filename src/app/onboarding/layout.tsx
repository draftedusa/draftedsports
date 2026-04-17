export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
