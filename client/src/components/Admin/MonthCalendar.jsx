import { useState } from "react";
import { useDatePicker } from "@rehookify/datepicker";

export default function MonthCalendar({ onSelectDay, selectedDay }) {
  const [dates, setDates] = useState(selectedDay ? [selectedDay] : []);
  const { data, propGetters } = useDatePicker({
    selectedDates: dates,
    onDatesChange: (newDates) => {
      setDates(newDates);
      if (newDates[0]) onSelectDay(newDates[0]);
    },
    // optionally configure calendar limits etc.
    // example: { minDate: startOfMonth, maxDate: endOfMonth }
  });

  // from data you get calendars, days, month, etc.
  const { calendars, weekDays } = data;
  const calendar = calendars[0]; // month calendar

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <button {...propGetters.previousMonthButton()}>{"<"}</button>
        <span>{calendar.month} {calendar.year}</span>
        <button {...propGetters.nextMonthButton()}>{">"}</button>
      </header>
      <div className="week-days row">
        {weekDays.map((wd) => (
          <div key={wd} className="weekday-cell">{wd}</div>
        ))}
      </div>
      <div className="days-grid">
        {calendar.days.map((dayObj) => (
          <button
            key={dayObj.$date.toISOString()}
            {...propGetters.dayButton(dayObj)}
            className={dayObj.selected ? "selected-day" : ""}
            disabled={dayObj.disabled}
          >
            {dayObj.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
