import { InstagramDuoToneBlue, SalesForceDuoToneBlue } from "@/icons";

type Props = {
  title: string;
  icon: React.ReactNode;
  description: string;
  strategy: "INSTAGRAM" | "CRM";
};

export const INTEGRATION_CARDS: Props[] = [
  {
    title: "Connect Instagram",
    description:
      "Link your Instagram Business account to enable ZeroPilot's DM & comment automation engine.",
    icon: <InstagramDuoToneBlue />,
    strategy: "INSTAGRAM",
  },
  {
    title: "CRM Coming Soon",
    description:
      "Manage everything through your Instagram DM directly - from converting to invoicing.",
    icon: <SalesForceDuoToneBlue />,
    strategy: "CRM",
  },
];
