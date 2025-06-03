import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PlanManager from "@/components/PlanManager";

export default function Plans() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] py-16 md:py-6">
          <PlanManager />
        </div>
      </div>
    </div>
  );
}
