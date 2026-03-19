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
  icons:
    "https://private-user-images.githubusercontent.com/99180855/399478068-9e74d0e3-d1dc-447b-b69b-538017f51992.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzU2NTE3NDksIm5iZiI6MTczNTY1MTQ0OSwicGF0aCI6Ii85OTE4MDg1NS8zOTk0NzgwNjgtOWU3NGQwZTMtZDFkYy00NDdiLWI2OWItNTM4MDE3ZjUxOTkyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDEyMzElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMjMxVDEzMjQwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJlZjE3YjlhYzAyNGE3YWEyNWQ1Y2VjZTVjMGI0YjI0NzRmMDBkNmY3OGQ4MGQ1YjljYWFiMDA0ZTY5ZWY3ZmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.UyOWRdw6hlgBxTqlWxMSxp-AxkDgoiLbR1Gkd_dxyuk",
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
        <div className="flex-1 flex flex-col lg:ml-[250px] relative z-10 px-6 py-4 lg:px-10 lg:py-8 min-h-screen overflow-x-hidden">
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
