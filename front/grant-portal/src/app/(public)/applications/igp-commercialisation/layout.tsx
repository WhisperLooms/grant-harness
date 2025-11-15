import IGPFormContextProvider from "./igp-form-context";

export default function IGPLayout({ children }: { children: React.ReactNode }) {
  return (
    <IGPFormContextProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </div>
    </IGPFormContextProvider>
  );
}
