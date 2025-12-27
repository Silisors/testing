"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface AavanceWidgetProps {
  amount: number;
  description: string;
  orderNumber?: string;
  buttonText?: string;
  userEmail?: string;
  userName?: string;
  userLastName?: string;
  userDocType?: string;
  userDocNum?: string;
  userPhone?: string;
}

declare global {
  interface Window {
    widgetCheckout: any;
  }
}

export default function AavanceWidget({
  amount,
  description,
  orderNumber,
  buttonText = "Pagar con Aavance",
  userEmail = "",
  userName = "",
  userLastName = "",
  userDocType = "",
  userDocNum = "",
  userPhone = "",
}: AavanceWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://merchantaavance.coopcentral.com.co/assetsWidget/css/index.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://merchantaavance.coopcentral.com.co/assetsWidget/js/index.js";
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!window.widgetCheckout) {
      return;
    }

    setLoading(true);

    try {
      const generatedOrderNumber = orderNumber || `ORD-${Date.now()}`;

      new window.widgetCheckout({
        merchant_id: process.env.NEXT_PUBLIC_AAVANCE_MERCHANT_ID,
        form_id: process.env.NEXT_PUBLIC_AAVANCE_FORM_ID,
        terminal_id: process.env.NEXT_PUBLIC_AAVANCE_TERMINAL_ID,
        order_number: generatedOrderNumber,
        amount: amount,
        currency: "COP",
        order_description: description,
        apikey: process.env.NEXT_PUBLIC_AAVANCE_API_KEY,
        client_email: userEmail,
        client_name: userName,
        client_lastname: userLastName,
        client_doctype: userDocType,
        client_numdoc: userDocNum,
        client_phone: userPhone,
      });

      setTimeout(() => {
        const modalBtn = document.getElementById("pwModal");
        if (modalBtn) {
          modalBtn.click();
        }
        setLoading(false);
      }, 1000);

    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <button style={{ display: "none" }} id="btn_pagar" />

      <div id="payment-widget"></div>

      <div style={{ display: "none" }}>
        <input type="hidden" id="fr" />
        <input type="hidden" id="tr" />
        <input type="hidden" id="pw_ypkiae" />
        <input type="hidden" id="pw_amt" />
        <input type="hidden" id="crry" />
        <input type="hidden" id="oderNm" />
        <input type="hidden" id="pw_ammount" />
        <input type="hidden" id="pw_tax" />
        <input type="hidden" id="pw_base0" />
        <input type="hidden" id="pw_base19" />

        <input type="hidden" id="itsSame" />
        <input type="hidden" id="order_description" />
        <input type="hidden" id="pw_tisactodnrion" />

        <input type="hidden" id="pw_manes" />
        <input type="hidden" id="pw_lsatManes" />
        <input type="hidden" id="pw_mnuDco" />
        <input type="hidden" id="pw_email" />
        <input type="hidden" id="pw_ytpeDco" />
        <input type="hidden" id="pw_phone" />
      </div>

      <Button
        onClick={handlePayment}
        disabled={!isLoaded || loading}
        className="w-full"
        variant="gradient"
      >
        {loading ? "Cargando..." : buttonText}
      </Button>
    </>
  );
}
