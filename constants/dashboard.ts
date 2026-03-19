import { v4 } from "uuid";

type Props = {
  id: string;
  label: string;
  subLabel: string;
  description: string;
};

export const DASHBOARD_CARDS: Props[] = [
  {
    id: v4(),
    label: "Auto-Reply Engine",
    subLabel: "Deliver instant DM responses to your followers",
    description: "Set keyword triggers and let ZeroPilot handle conversations 24/7",
  },
  {
    id: v4(),
    label: "AI Comment Responder",
    subLabel: "Engage commenters automatically with smart replies",
    description: "Every comment gets a personalized response matched to your brand",
  },
  {
    id: v4(),
    label: "Business Brain",
    subLabel: "Train your AI with your business context",
    description: "Configure your brand persona and let Gemini AI do the rest",
  },
];
