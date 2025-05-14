"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se há um consentimento armazenado
    const storedConsent = localStorage.getItem("cookieConsent");
    if (storedConsent !== null) {
      setConsent(storedConsent === "true");
      setShowBanner(false); // Mantém o banner oculto se já tiver uma escolha armazenada
    } else {
      // Só mostra o banner caso não exista consentimento salvo
      setShowBanner(true);
    }
    setInitialized(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "false");
    setConsent(false);
    setShowBanner(false);
  };

  // Não renderiza nada até que a verificação do localStorage seja concluída
  if (!initialized || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-secondary text-secondary-foreground p-4 flex flex-col md:flex-row items-center justify-between shadow-md border-t">
      <p className="text-sm text-muted-foreground">
        Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{" "}
        <a href="/politica-de-cookies" className="underline text-primary">Política de Cookies</a>.
      </p>
      <div className="flex space-x-2 mt-2 md:mt-0">
        <Button onClick={handleAccept} className="bg-success hover:bg-success/90 text-success-foreground">
          Aceitar
        </Button>
        <Button onClick={handleReject} variant="outline" className="border-muted-foreground text-muted-foreground hover:bg-muted hover:text-muted-foreground">
          Recusar
        </Button>
      </div>
    </div>
  );
}