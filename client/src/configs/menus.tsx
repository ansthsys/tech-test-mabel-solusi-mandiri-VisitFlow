import { ReactNode } from "react";
import { Building2Icon, CircleGauge, TicketsPlaneIcon } from "lucide-react";

export type MenuItem = {
  name: string;
  icon: ReactNode;
  route: string;
  childs?: MenuItem[];
};

const menus: MenuItem[] = [
  {
    name: "sidebar.dashboard",
    icon: <CircleGauge className="h-[18px] w-[18px]" />,
    route: "/dashboard",
  },
  {
    name: "sidebar.entity",
    icon: <Building2Icon className="h-[18px] w-[18px]" />,
    route: "/entities",
  },
  {
    name: "sidebar.activity",
    icon: <TicketsPlaneIcon className="h-[18px] w-[18px]" />,
    route: "/activities",
  },
];

export default menus;
