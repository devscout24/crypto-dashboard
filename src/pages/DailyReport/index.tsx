import { useTitleStore } from "@/stores/titleStore";
import { useEffect } from "react";
import DailyReportCard from "./components/DailyReportCard";
import { useProfile } from "@/queries/userQueries";

export default function DailyReportPage() {
  const { setTitle } = useTitleStore();
  const { data: userData } = useProfile();
  console.log({ userData });

  useEffect(() => {
    setTitle("Daily Report");
    return () => setTitle("Dashboard");
  }, [setTitle]);

  return (
    // asd
    <section className="section-container">
      <div className="w-full">
        <h3 className="justify-start text-muted-foreground text-lg font-medium font-Inter ">
          Comprehensive daily performance analysis and market commentary
        </h3>
      </div>
      <DailyReportCard />
    </section>
  );
}
