import { FaSmile } from "react-icons/fa";
import { FaFaceSadCry, FaFaceMeh } from "react-icons/fa6";
import { ImSad2 } from "react-icons/im";
import { GiMineExplosion } from "react-icons/gi";
export const emojiOptions = [
  {
    level: 0,
    icon: FaSmile,
    label: "AUCUNE",
    color: "text-blue-400",
    bgColor: "bg-blue-100",
    hoverBg: "hover:bg-blue-200",
  },
  {
    level: 1,
    icon: FaFaceMeh,
    label: "LÉGÈRE",
    color: "text-blue-500",
    bgColor: "bg-blue-200",
    hoverBg: "hover:bg-blue-300",
  },
  {
    level: 2,
    icon: ImSad2,
    label: "MODÉRÉE",
    color: "text-blue-600",
    bgColor: "bg-blue-300",
    hoverBg: "hover:bg-blue-400",
  },
  {
    level: 3,
    icon: FaFaceSadCry,
    label: "FORTE",
    color: "text-blue-700",
    bgColor: "bg-blue-400",
    hoverBg: "hover:bg-blue-500",
  },
  {
    level: 4,
    icon: GiMineExplosion,
    label: "INSUPPORTABLE",
    color: "text-blue-800",
    bgColor: "bg-blue-500",
    hoverBg: "hover:bg-blue-600",
  },
];
