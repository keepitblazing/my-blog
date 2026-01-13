"use client";

import GitHubCalendar from "react-github-calendar";
import "./GitHubContributions.css";

export default function GitHubContributions() {
  const selectLastHalfYear = (contributions: any) => {
    const currentDate = new Date();
    const halfYearAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    
    return contributions.filter((activity: any) => {
      const date = new Date(activity.date);
      return date > halfYearAgo;
    });
  };

  const theme = {
    light: ["#000000", "#222225", "#2a2a2f", "#3a3a3f", "#4a4a4f"],
    dark: ["#000000", "#222225", "#2a2a2f", "#3a3a3f", "#4a4a4f"],
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-fit">
          <GitHubCalendar
            username="keepitblazing"
            colorScheme="dark"
            theme={theme}
            transformData={selectLastHalfYear}
            labels={{
              totalCount: "지난 6개월간 {{count}}개의 contributions",
            }}
            style={{
              color: "#e5e5e7",
            }}
            blockSize={12}
            blockMargin={4}
            fontSize={14}
          />
        </div>
      </div>
    </div>
  );
}