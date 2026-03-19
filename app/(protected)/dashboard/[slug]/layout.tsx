import NavBar from "@/components/global/navbar";
import Sidebar from "@/components/global/sidebar";
import {
  PrefetchUserAutomation,
  PrefetchUserProfile,
} from "@/react-query/prefetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ZeroPilot Dashboard",
  description: "Instagram DM Automation",
  icons: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none'><rect width='40' height='40' rx='10' fill='%234a7dff'/><path d='M12 12H28V15L16 25V25.5H28V29H12V26L24 16V15.5H12V12Z' fill='white'/></svg>",
};

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

async function Layout({ children, params }: Props) {
  const query = new QueryClient();

  await PrefetchUserProfile(query);

  await PrefetchUserAutomation(query);

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex w-full min-h-screen bg-[#05060b] relative overflow-hidden">
        {/* Deep background gradient for premium feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4a7dff]/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6c2bd9]/[0.05] rounded-full blur-[120px] pointer-events-none" />
        
        <Sidebar slug={params.slug} />
        <div className="flex-1 flex flex-col lg:ml-[250px] relative z-10 px-4 py-4 lg:px-6 lg:py-8 min-h-screen overflow-x-hidden">
          <NavBar slug={params.slug} />
          <div className="flex-1 mt-6">
            {children}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default Layout;
