import { Badge } from "@/components/ui/badge";
export const DiagrammeDentaire = ({ selectedTeeth, onToothSelect }) => {
  // Données des dents avec positions et types
  const teethData = {
    // Quadrant 1 (Supérieur droit)
    1: [
      { number: 18, name: "3ème molaire", type: "Molaire", x: 50, y: 80 },
      { number: 17, name: "2ème molaire", type: "Molaire", x: 80, y: 75 },
      { number: 16, name: "1ère molaire", type: "Molaire", x: 110, y: 70 },
      {
        number: 15,
        name: "2ème prémolaire",
        type: "Prémolaire",
        x: 140,
        y: 65,
      },
      {
        number: 14,
        name: "1ère prémolaire",
        type: "Prémolaire",
        x: 170,
        y: 60,
      },
      { number: 13, name: "Canine", type: "Canine", x: 200, y: 55 },
      {
        number: 12,
        name: "Incisive latérale",
        type: "Incisive",
        x: 230,
        y: 50,
      },
      {
        number: 11,
        name: "Incisive centrale",
        type: "Incisive",
        x: 260,
        y: 45,
      },
    ],
    // Quadrant 2 (Supérieur gauche)
    2: [
      {
        number: 21,
        name: "Incisive centrale",
        type: "Incisive",
        x: 290,
        y: 45,
      },
      {
        number: 22,
        name: "Incisive latérale",
        type: "Incisive",
        x: 320,
        y: 50,
      },
      { number: 23, name: "Canine", type: "Canine", x: 350, y: 55 },
      {
        number: 24,
        name: "1ère prémolaire",
        type: "Prémolaire",
        x: 380,
        y: 60,
      },
      {
        number: 25,
        name: "2ème prémolaire",
        type: "Prémolaire",
        x: 410,
        y: 65,
      },
      { number: 26, name: "1ère molaire", type: "Molaire", x: 440, y: 70 },
      { number: 27, name: "2ème molaire", type: "Molaire", x: 470, y: 75 },
      { number: 28, name: "3ème molaire", type: "Molaire", x: 500, y: 80 },
    ],
    // Quadrant 3 (Inférieur gauche)
    3: [
      {
        number: 31,
        name: "Incisive centrale",
        type: "Incisive",
        x: 290,
        y: 255,
      },
      {
        number: 32,
        name: "Incisive latérale",
        type: "Incisive",
        x: 320,
        y: 250,
      },
      { number: 33, name: "Canine", type: "Canine", x: 350, y: 245 },
      {
        number: 34,
        name: "1ère prémolaire",
        type: "Prémolaire",
        x: 380,
        y: 240,
      },
      {
        number: 35,
        name: "2ème prémolaire",
        type: "Prémolaire",
        x: 410,
        y: 235,
      },
      { number: 36, name: "1ère molaire", type: "Molaire", x: 440, y: 230 },
      { number: 37, name: "2ème molaire", type: "Molaire", x: 470, y: 225 },
      { number: 38, name: "3ème molaire", type: "Molaire", x: 500, y: 220 },
    ],
    // Quadrant 4 (Inférieur droit)
    4: [
      { number: 48, name: "3ème molaire", type: "Molaire", x: 50, y: 220 },
      { number: 47, name: "2ème molaire", type: "Molaire", x: 80, y: 225 },
      { number: 46, name: "1ère molaire", type: "Molaire", x: 110, y: 230 },
      {
        number: 45,
        name: "2ème prémolaire",
        type: "Prémolaire",
        x: 140,
        y: 235,
      },
      {
        number: 44,
        name: "1ère prémolaire",
        type: "Prémolaire",
        x: 170,
        y: 240,
      },
      { number: 43, name: "Canine", type: "Canine", x: 200, y: 245 },
      {
        number: 42,
        name: "Incisive latérale",
        type: "Incisive",
        x: 230,
        y: 250,
      },
      {
        number: 41,
        name: "Incisive centrale",
        type: "Incisive",
        x: 260,
        y: 255,
      },
    ],
  };

  const getToothColor = (type, isSelected) => {
    if (isSelected) return "#3b82f6";
    switch (type) {
      case "Incisive":
        return "#e0e7ff";
      case "Canine":
        return "#c7d2fe";
      case "Prémolaire":
        return "#a5b4fc";
      case "Molaire":
        return "#8b5cf6";
      default:
        return "#e0e7ff";
    }
  };

  const getToothShape = (type, x, y, isSelected, tooth) => {
    const baseProps = {
      className: `tooth ${isSelected ? "selected" : ""}`,
      onClick: () => onToothSelect(tooth.number),
    };

    // Si la dent est sélectionnée, afficher un cercle
    if (isSelected) {
      return (
        <circle
          {...baseProps}
          cx={x}
          cy={y}
          r="14"
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth="3"
        />
      );
    }

    // Sinon, afficher la forme normale selon le type
    switch (type) {
      case "Incisive":
        return (
          <rect
            {...baseProps}
            x={x - 8}
            y={y - 12}
            width="16"
            height="24"
            rx="3"
            fill={getToothColor(type, isSelected)}
            stroke="#475569"
            strokeWidth="1"
          />
        );
      case "Canine":
        return (
          <polygon
            {...baseProps}
            points={`${x - 8},${y + 10} ${x},${y - 12} ${x + 8},${y + 10}`}
            fill={getToothColor(type, isSelected)}
            stroke="#475569"
            strokeWidth="1"
          />
        );
      case "Prémolaire":
        return (
          <rect
            {...baseProps}
            x={x - 10}
            y={y - 10}
            width="20"
            height="20"
            rx="4"
            fill={getToothColor(type, isSelected)}
            stroke="#475569"
            strokeWidth="1"
          />
        );
      case "Molaire":
        return (
          <rect
            {...baseProps}
            x={x - 12}
            y={y - 12}
            width="24"
            height="24"
            rx="4"
            fill={getToothColor(type, isSelected)}
            stroke="#475569"
            strokeWidth="1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="diagram-container p-8">
      <div className="text-center mb-6">
        <h4 className="subsection-title">Diagramme Dentaire FDI</h4>
        <p className="text-slate-600 text-lg">
          Cliquez sur les dents concernées
        </p>
      </div>

      <svg viewBox="0 0 550 300" className="w-full h-auto max-w-3xl mx-auto">
        {/* Lignes de séparation des quadrants */}
        <line
          x1="275"
          y1="30"
          x2="275"
          y2="270"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.6"
        />
        <line
          x1="30"
          y1="150"
          x2="520"
          y2="150"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.6"
        />

        {/* Labels des quadrants */}
        <text x="150" y="25" className="quadrant-label">
          Quadrant 1 (Supérieur Droit)
        </text>
        <text x="400" y="25" className="quadrant-label">
          Quadrant 2 (Supérieur Gauche)
        </text>
        <text x="400" y="290" className="quadrant-label">
          Quadrant 3 (Inférieur Gauche)
        </text>
        <text x="150" y="290" className="quadrant-label">
          Quadrant 4 (Inférieur Droit)
        </text>

        {/* Rendu des dents */}
        {Object.entries(teethData).map(([quadrant, teeth]) =>
          teeth.map((tooth) => {
            const isSelected = selectedTeeth?.some(
              (t) => t.number === tooth.number
            );
            return (
              <g key={tooth.number}>
                {getToothShape(tooth.type, tooth.x, tooth.y, isSelected, tooth)}
                <text x={tooth.x} y={tooth.y} className="tooth-number">
                  {tooth.number}
                </text>
              </g>
            );
          })
        )}

        {/* Légende des types de dents */}
        <g transform="translate(30, 320)">
          <rect
            x="0"
            y="0"
            width="16"
            height="24"
            rx="3"
            fill="#e0e7ff"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x="25"
            y="15"
            className="tooth-number"
            style={{ fontSize: "11px", textAnchor: "start", fill: "#4338ca" }}
          >
            Incisive
          </text>

          <polygon
            points="60,24 68,0 76,24"
            fill="#c7d2fe"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x="85"
            y="15"
            className="tooth-number"
            style={{ fontSize: "11px", textAnchor: "start", fill: "#4338ca" }}
          >
            Canine
          </text>

          <rect
            x="130"
            y="2"
            width="20"
            height="20"
            rx="4"
            fill="#a5b4fc"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x="160"
            y="15"
            className="tooth-number"
            style={{ fontSize: "11px", textAnchor: "start", fill: "#4338ca" }}
          >
            Prémolaire
          </text>

          <rect
            x="220"
            y="0"
            width="24"
            height="24"
            rx="4"
            fill="#8b5cf6"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x="255"
            y="15"
            className="tooth-number"
            style={{ fontSize: "11px", textAnchor: "start", fill: "#4338ca" }}
          >
            Molaire
          </text>
        </g>
      </svg>

      {selectedTeeth && selectedTeeth.length > 0 && (
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            {selectedTeeth.map((tooth) => (
              <Badge
                key={tooth.number}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-base px-6 py-3 rounded-full shadow-lg"
              >
                🦷 {tooth.number} - {tooth.name}
              </Badge>
            ))}
          </div>
          <p className="text-slate-600 mt-4 text-lg">
            {selectedTeeth.length} dent{selectedTeeth.length > 1 ? "s" : ""}{" "}
            sélectionnée
            {selectedTeeth.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};
