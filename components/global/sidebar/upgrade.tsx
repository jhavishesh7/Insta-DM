import React from "react";
import PaymentButton from "../payment-button";

type Props = {};

function UpgradeCard({}: Props) {
  return (
    <div className="bg-gradient-to-br from-[#4a7dff]/10 to-[#6c2bd9]/10 p-4 rounded-xl flex flex-col gap-y-3 border border-white/5">
      <span className="text-sm text-white/70 font-medium">
        Upgrade to{" "}
        <span className="bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] font-black bg-clip-text text-transparent">
          ZeroPilot PRO
        </span>
      </span>
      <p className="text-white/40 text-xs leading-relaxed">
        Unlock AI-powered responses, <br />unlimited automations & more
      </p>
      <PaymentButton />
    </div>
  );
}

export default UpgradeCard;
