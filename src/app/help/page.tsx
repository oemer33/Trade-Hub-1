export default function HelpPage() {
  return (
    <div className="space-y-3 text-xs">
      <h1 className="text-lg font-semibold">Hilfe & Support</h1>
      <p>
        Hier findest du Informationen zu Kaufen, Verkaufen, Zahlungen,
        Bewertungen und Sicherheit auf TradeHub.
      </p>
      <ul className="list-disc pl-4 space-y-1">
        <li>Sichere Kommunikation nur über die Plattform.</li>
        <li>Kein Versand ohne Zahlungseingang (bzw. Treuhand-Lösung).</li>
        <li>Verdächtige Aktivitäten bitte sofort melden.</li>
      </ul>
    </div>
  );
}
