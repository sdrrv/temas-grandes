import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutGrid,
  Clock,
  BookOpen,
  Star,
  Circle,
} from "lucide-react";

const CommunityCalendar = () => {
  // Current date for initializing the calendar
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // 'month' or 'year'

  // Group colors with a church-appropriate palette
  const groupColors = {
    "Group 1":
      "bg-indigo-100 hover:bg-indigo-200 border-indigo-500 text-indigo-700",
    "Group 2":
      "bg-amber-100 hover:bg-amber-200 border-amber-500 text-amber-700",
    "Group 3":
      "bg-emerald-100 hover:bg-emerald-200 border-emerald-500 text-emerald-700",
    "Group 4": "bg-rose-100 hover:bg-rose-200 border-rose-500 text-rose-700",
  };

  // Community schedule data
  const scheduleData = {
    "Group 1": [
      { status: "preparing", begin: "01-02-2025", ending: "31-03-2025" },
      { status: "celebrating", begin: "01-04-2025", ending: "30-06-2025" },
    ],
    "Group 2": [
      { status: "celebrating", begin: "01-01-2025", ending: "20-02-2025" },
    ],
    "Group 3": [],
    "Group 4": [],
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "celebrating":
        return <Star size={16} className="text-yellow-500" />;
      case "preparing":
        return <BookOpen size={16} className="text-blue-500" />;
      case "idle":
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  // Helper to parse date string (DD-MM-YYYY) into Date object
  const parseScheduleDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to format Date as DD-MM-YYYY
  const formatAsDateMonthYear = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Get group status for a specific date
  const getGroupStatus = (group, date) => {
    const groupSchedule = scheduleData[group] || [];

    for (const period of groupSchedule) {
      const beginDate = parseScheduleDate(period.begin);
      const endDate = parseScheduleDate(period.ending);

      // Make end date inclusive by setting it to end of day
      endDate.setHours(23, 59, 59, 999);

      if (date >= beginDate && date <= endDate) {
        return period.status;
      }
    }

    return "idle";
  };

  // Get all groups that are celebrating on a specific date
  const getCelebratingGroups = (date) => {
    return Object.keys(scheduleData).filter(
      (group) => getGroupStatus(group, date) === "celebrating"
    );
  };

  // Get all groups that are preparing on a specific date
  const getPreparingGroups = (date) => {
    return Object.keys(scheduleData).filter(
      (group) => getGroupStatus(group, date) === "preparing"
    );
  };

  // Generate days of week header
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Get days in month
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };

  // Navigate to previous/next month or year
  const navigatePrev = () => {
    const newDate = new Date(viewDate);
    if (viewMode === "month") {
      newDate.setMonth(viewDate.getMonth() - 1);
    } else {
      newDate.setFullYear(viewDate.getFullYear() - 1);
    }
    setViewDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(viewDate);
    if (viewMode === "month") {
      newDate.setMonth(viewDate.getMonth() + 1);
    } else {
      newDate.setFullYear(viewDate.getFullYear() + 1);
    }
    setViewDate(newDate);
  };

  // Get month name
  const getMonthName = (date) => {
    const monthName = date.toLocaleString("pt-PT", { month: "long" });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  // Get abbreviated month name
  const getShortMonthName = (monthIndex) => {
    const date = new Date();
    date.setMonth(monthIndex);
    return date.toLocaleString("default", { month: "short" });
  };

  // Switch between month and year view
  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "year" : "month");
  };

  // View specific month from year view
  const viewSpecificMonth = (monthIndex) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    setViewMode("month");
  };

  // Translate status to Portuguese
  const translateStatus = (status) => {
    switch (status) {
      case "celebrating":
        return "a celebrar";
      case "preparing":
        return "a preparar";
      case "idle":
      default:
        return "inativo";
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const lastMonthDays =
      month === 0
        ? getDaysInMonth(year - 1, 11)
        : getDaysInMonth(year, month - 1);

    let days = [];

    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, lastMonthDays - i);
      days.push({ date, isCurrentMonth: false });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Add days from next month to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 columns
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  // Generate weeks from days array
  const generateCalendarWeeks = () => {
    const days = generateCalendarGrid();
    const weeks = [];

    // Group days into weeks
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  // Generate month data for year view
  const generateMonthsForYear = () => {
    const year = viewDate.getFullYear();
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDayOfMonth = new Date(year, monthIndex, 1);
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

      // Get groups active at any point during this month
      const celebratingGroups = new Set();
      const preparingGroups = new Set();

      // Check each day of the month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(year, monthIndex, day);

        // Add groups to Sets to avoid duplicates
        getCelebratingGroups(currentDate).forEach((group) =>
          celebratingGroups.add(group)
        );

        getPreparingGroups(currentDate).forEach((group) =>
          preparingGroups.add(group)
        );
      }

      return {
        index: monthIndex,
        name: getShortMonthName(monthIndex),
        fullName: getMonthName(firstDayOfMonth),
        celebratingGroups: Array.from(celebratingGroups),
        preparingGroups: Array.from(preparingGroups),
        isCurrentMonth:
          currentDate.getMonth() === monthIndex &&
          currentDate.getFullYear() === year,
      };
    });
  };

  // Calculate activity spans for a week
  const calculateWeekActivitySpans = (week) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const celebratingSpans = {};
    const preparingSpans = {};

    // For each group, determine the spans within this week
    Object.keys(scheduleData).forEach((group) => {
      const activities = scheduleData[group] || [];

      activities.forEach((activity) => {
        const beginDate = parseScheduleDate(activity.begin);
        const endDate = parseScheduleDate(activity.ending);
        endDate.setHours(23, 59, 59, 999); // Make end date inclusive

        // Check if this activity intersects with the current week
        const activityInWeek = week.some((day) => {
          const dayDate = day.date;
          return (
            dayDate >= beginDate && dayDate <= endDate && day.isCurrentMonth
          );
        });

        if (!activityInWeek) return;

        // Find the start and end positions within this week
        let startIdx = 0;
        let endIdx = 6;

        // Adjust start index if activity begins after the first day of the week
        for (let i = 0; i < week.length; i++) {
          const dayDate = week[i].date;

          if (dayDate >= beginDate && week[i].isCurrentMonth) {
            startIdx = i;
            break;
          }
        }

        // Adjust end index if activity ends before the last day of the week
        for (let i = week.length - 1; i >= 0; i--) {
          const dayDate = week[i].date;

          if (dayDate <= endDate && week[i].isCurrentMonth) {
            endIdx = i;
            break;
          }
        }

        // Only add spans that include current month days
        if (week[startIdx].isCurrentMonth || week[endIdx].isCurrentMonth) {
          // Store the span information
          if (activity.status === "celebrating") {
            if (!celebratingSpans[group]) celebratingSpans[group] = [];
            celebratingSpans[group].push({
              startIdx,
              endIdx,
              startDate: week[startIdx].date,
              endDate: week[endIdx].date,
            });
          } else if (activity.status === "preparing") {
            if (!preparingSpans[group]) preparingSpans[group] = [];
            preparingSpans[group].push({
              startIdx,
              endIdx,
              startDate: week[startIdx].date,
              endDate: week[endIdx].date,
            });
          }
        }
      });
    });

    return {
      celebratingSpans,
      preparingSpans,
    };
  };

  // Render Month View
  const renderMonthView = () => {
    const weeks = generateCalendarWeeks();

    return (
      <div className="rounded-lg overflow-hidden border border-gray-200">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-gray-600 font-medium text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        <div className="relative">
          {/* Grid of days */}
          {weeks.map((week, weekIndex) => {
            const { celebratingSpans, preparingSpans } =
              calculateWeekActivitySpans(week);

            return (
              <div key={weekIndex} className="grid grid-cols-7 relative">
                {week.map((day, dayIndex) => {
                  const isToday = isSameDay(day.date, currentDate);
                  return (
                    <div
                      key={dayIndex}
                      className={`h-28 p-1 border-t border-l border-gray-200 relative ${
                        dayIndex === 6 ? "border-r" : ""
                      } ${weekIndex === 5 ? "border-b" : ""} ${
                        !day.isCurrentMonth ? "bg-gray-50" : ""
                      }`}
                    >
                      <div
                        className={`text-right mb-1 ${
                          !day.isCurrentMonth ? "text-gray-400" : ""
                        }`}
                      >
                        {isToday ? (
                          <div className="bg-blue-500 text-white rounded-full pb-0.5 w-7 h-7 flex items-center justify-center float-right">
                            {day.date.getDate()}
                          </div>
                        ) : (
                          day.date.getDate()
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Render celebrating group spans */}
                {Object.entries(celebratingSpans).map(([group, spans]) =>
                  spans.map((span, spanIndex) => {
                    const spanWidth =
                      ((span.endIdx - span.startIdx + 1) * 100) / 7;
                    const leftOffset = (span.startIdx * 100) / 7;

                    return (
                      <div
                        key={`celebrating-${group}-${spanIndex}-${weekIndex}`}
                        className={`absolute left-0 top-10 px-2 z-10 duration-300 transition-all`}
                        style={{
                          width: `${spanWidth}%`,
                          left: `${leftOffset}%`,
                          opacity: "0.95",
                        }}
                      >
                        <div
                          className={`rounded-md p-1 text-xs truncate ${
                            groupColors[group].split(" ")[0]
                          } border ${
                            groupColors[group].split(" ")[2]
                          } shadow-sm`}
                        >
                          <div className="truncate flex items-center gap-1">
                            <Star size={12} />
                            <b>{group}</b> a celebrar
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Render preparing group spans */}
                {Object.entries(preparingSpans).map(([group, spans]) =>
                  spans.map((span, spanIndex) => {
                    const spanWidth =
                      ((span.endIdx - span.startIdx + 1) * 100) / 7;
                    const leftOffset = (span.startIdx * 100) / 7;

                    return (
                      <div
                        key={`preparing-${group}-${spanIndex}-${weekIndex}`}
                        className={`absolute left-0 bottom-2 px-2 z-10 duration-300 transition-all`}
                        style={{
                          width: `${spanWidth}%`,
                          left: `${leftOffset}%`,
                          opacity: "0.95",
                        }}
                      >
                        <div
                          className={`rounded-md p-1 text-xs truncate ${
                            groupColors[group].split(" ")[0]
                          } border ${
                            groupColors[group].split(" ")[2]
                          } shadow-sm`}
                        >
                          <div className="truncate flex items-center gap-1">
                            <BookOpen size={12} />
                            <b>{group}</b> a preparar
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Year View
  const renderYearView = () => {
    const year = viewDate.getFullYear();
    const months = generateMonthsForYear();

    // Group months by quarter
    const quarters = [
      months.slice(0, 3),
      months.slice(3, 6),
      months.slice(6, 9),
      months.slice(9, 12),
    ];

    return (
      <div className="space-y-8">
        {quarters.map((quarterMonths, quarterIndex) => (
          <div
            key={quarterIndex}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-semibold">
                T{quarterIndex + 1} {year}
              </h3>
            </div>

            <div className="grid grid-cols-3 divide-x">
              {quarterMonths.map((month) => {
                return (
                  <div
                    key={month.index}
                    className={`relative p-4 ${
                      month.isCurrentMonth ? "bg-blue-50" : ""
                    }`}
                    onClick={() => viewSpecificMonth(month.index)}
                  >
                    <h4 className="font-medium mb-6 text-center">
                      {month.fullName}
                    </h4>

                    {/* Celebrating cards */}
                    {month.celebratingGroups.length > 0 ? (
                      month.celebratingGroups.map((group) => (
                        <div
                          key={`${month.index}-${group}`}
                          className={`rounded-lg p-3 mb-2 cursor-pointer ${
                            groupColors[group].split(" ")[0]
                          } border ${groupColors[group].split(" ")[2]}`}
                        >
                          <div className="text-sm font-medium truncate flex items-center gap-1">
                            <Star size={14} />
                            {group}
                          </div>
                          <div className="text-xs opacity-75">A celebrar</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg p-3 mb-2 bg-gray-50 border border-gray-200 cursor-pointer">
                        <div className="text-sm font-medium truncate flex items-center gap-1">
                          <Circle size={14} className="text-gray-400" />
                          Sem celebrações
                        </div>
                      </div>
                    )}

                    {/* Preparing cards */}
                    {month.preparingGroups.length > 0 ? (
                      month.preparingGroups.map((group) => (
                        <div
                          key={`${month.index}-prep-${group}`}
                          className={`rounded-lg p-3 cursor-pointer ${
                            groupColors[group].split(" ")[0]
                          } border ${groupColors[group].split(" ")[2]}`}
                        >
                          <div className="text-sm font-medium truncate flex items-center gap-1">
                            <BookOpen size={14} />
                            {group}
                          </div>
                          <div className="text-xs opacity-75">A preparar</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg p-3 bg-gray-50 border border-gray-200 cursor-pointer">
                        <div className="text-sm font-medium truncate flex items-center gap-1">
                          <Circle size={14} className="text-gray-400" />
                          Sem preparações
                        </div>
                      </div>
                    )}

                    {month.isCurrentMonth && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-gray-700" size={24} />
          <span>Celebrações da 7 Comunidade</span>
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrev}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={viewMode === "month" ? "Mês anterior" : "Ano anterior"}
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-lg font-semibold min-w-24 text-center">
            {viewMode === "month"
              ? `${getMonthName(viewDate)} ${viewDate.getFullYear()}`
              : viewDate.getFullYear()}
          </h2>

          <button
            onClick={navigateNext}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={viewMode === "month" ? "Próximo mês" : "Próximo ano"}
          >
            <ChevronRight size={20} />
          </button>

          <button
            onClick={toggleViewMode}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            aria-label={`Mudar para vista de ${
              viewMode === "month" ? "ano" : "mês"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          <div className="relative ml-1">
            <button
              disabled
              className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-30"
              aria-label="Informação do calendário"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View (Month or Year) */}
      {viewMode === "month" ? renderMonthView() : renderYearView()}

      {/* Group Status - Minimalist Version */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Estado dos Grupos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(groupColors).map((group) => {
            const status = getGroupStatus(group, viewDate);

            return (
              <div
                key={group}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <span className="font-medium">{group}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-xs uppercase">
                    {translateStatus(status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityCalendar;
