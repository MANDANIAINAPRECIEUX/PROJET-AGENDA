import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanQRCode() {
  const [status, setStatus] = useState("");
  const [dentiste, setDentiste] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(async (data) => {
      console.log("QR détecté :", data);
      setStatus("QR détecté : " + data);

      try {
        const res = await axios.get("/api/dentistes/verify/" + data);
        setDentiste(res.data.dentiste);

        // 🔥 Redirection vers une page personnalisée
        window.location.href = "/dentiste/" + data;

      } catch (error) {
        console.error(error);
        setStatus("Badge invalide ❌");
      }
    });

    return () => scanner.clear();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Scanner un QR Code</h2>
      <div id="reader" style={{ width: 300 }}></div>

      <p style={{ marginTop: 20, fontWeight: "bold" }}>{status}</p>
    </div>
  );
}
