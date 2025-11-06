import douleurdentaire from "../../assets/images/douleurdentaire.JPG";
import sensibilité from "../../assets/images/sensibilité.JPG";
import mobilité from "../../assets/images/mobilité.JPG";
import gonflement from "../../assets/images/gonflement.png";
import a from "../../assets/images/a.jpg";
import carie from "../../assets/images/carie.JPG";
import fracture from "../../assets/images/fracture.JPG";

export const typesSymptomes = [
  {
    name: "Douleur",
    icon: <img src={douleurdentaire} alt="Douleur" className="w-8 h-8" />,
  },
  {
    name: "Sensibilité",
    icon: <img src={sensibilité} alt="Sensibilité" className="w-8 h-8" />,
  },
  {
    name: "Mobilité",
    icon: <img src={mobilité} alt="Mobilité" className="w-8 h-8" />,
  },
  {
    name: "Gonflement",
    icon: <img src={gonflement} alt="Mobilité" className="w-8 h-8" />,
  },
  {
    name: "Saignement",
    icon: <img src={a} alt="Mobilité" className="w-8 h-8" />,
  },
  {
    name: "Carie",
    icon: <img src={carie} alt="Mobilité" className="w-8 h-8" />,
  },
  {
    name: "Fracture",
    icon: <img src={fracture} alt="fracture" className="w-8 h-8" />,
  },
  { name: "Autre", icon: "💙" },
];
