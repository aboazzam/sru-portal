import { getCurrentUser } from "@/lib/dal";
import SanadSidebar from "./_components/SanadSidebar";

export default async function SanadLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div
      className="-mx-6 -my-6 flex"
      style={{
        minHeight: "calc(100vh - 73px)",
        "--sanad-purple":      "#3D1F6E",
        "--sanad-purple-dark": "#2C1650",
        "--sanad-purple-light":"#6B46C1",
        "--sanad-purple-faint":"#F5F3FF",
        "--sanad-cyan":        "#00B4C8",
        "--sanad-cyan-dark":   "#0097AA",
        "--sanad-cyan-light":  "#E0F7FA",
        "--sanad-text":        "#1F2937",
      } as React.CSSProperties}
    >
      <SanadSidebar role={user?.role ?? "STUDENT"} userName={user?.name ?? ""} />

      <div className="flex-1 min-w-0 bg-[#F5F3FF] overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
