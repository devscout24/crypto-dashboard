"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

function formatDateTime(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const dateStr = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  return `${dateStr} ${timeStr}`;
}

function parseDateTime(str: string): Date | undefined {
  const match = str.match(/(\w+) (\d{2}), (\d{4}) (\d{2}):(\d{2})/);
  if (!match) {
    return undefined;
  }
  const [, month, day, year, hour, minute] = match;
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  if (isNaN(monthIndex)) {
    return undefined;
  }
  const parsedDate = new Date(
    parseInt(year),
    monthIndex,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

function isValidDate(date: Date | undefined): boolean {
  return !!date && !isNaN(date.getTime());
}

export function DateTimePicker({
  value,
  onChange,
}: {
  value?: string; // ISO format like "2025-06-01T12:00"
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(new Date());
  const [tempHour, setTempHour] = React.useState("00");
  const [tempMinute, setTempMinute] = React.useState("00");
  const [month, setMonth] = React.useState<Date | undefined>(new Date());
  const [inputValue, setInputValue] = React.useState("");

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) {
      const dateParts = value.split("T");
      if (dateParts.length === 2) {
        const d = new Date(`${dateParts[0]}T${dateParts[1]}:00`);
        if (isValidDate(d)) {
          setTempDate(d);
          setTempHour(padZero(d.getHours()));
          setTempMinute(padZero(d.getMinutes()));
          setMonth(d);
          setInputValue(formatDateTime(d));
        }
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  React.useEffect(() => {
    if (open && hourRef.current) {
      const selectedHour = hourRef.current.querySelector(
        `[data-hour="${tempHour}"]`
      );
      selectedHour?.scrollIntoView({ block: "center" });
    }
    if (open && minuteRef.current) {
      const selectedMinute = minuteRef.current.querySelector(
        `[data-minute="${tempMinute}"]`
      );
      selectedMinute?.scrollIntoView({ block: "center" });
    }
  }, [open, tempHour, tempMinute]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const parsed = parseDateTime(newValue);
    if (parsed) {
      const iso = parsed.toISOString().slice(0, 16);
      onChange?.(iso);
      setTempDate(parsed);
      setTempHour(padZero(parsed.getHours()));
      setTempMinute(padZero(parsed.getMinutes()));
      setMonth(parsed);
    }
  };

  const handleApply = () => {
    const newDate = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate(),
      parseInt(tempHour),
      parseInt(tempMinute)
    );
    const iso = newDate.toISOString().slice(0, 16);
    onChange?.(iso);
    setInputValue(formatDateTime(newDate));
    setOpen(false);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="datetime"
        value={inputValue}
        placeholder="June 01, 2025 00:00"
        className="bg-background pr-10 w-full"
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="datetime-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date and time</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex flex-col items-center"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <div className="flex items-center flex-col md:flex-row">
            <Calendar
              mode="single"
              selected={tempDate}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => d && setTempDate(d)}
              captionLayout="dropdown"
            />
            <div className="flex items-stretch gap-2 p-4 pt-0">
              <div
                ref={hourRef}
                className="h-78 overflow-y-auto border rounded-md flex flex-col"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = padZero(i);
                  return (
                    <div
                      key={hour}
                      data-hour={hour}
                      className={`p-2 cursor-pointer text-center ${
                        tempHour === hour
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setTempHour(hour)}
                    >
                      {hour}
                    </div>
                  );
                })}
              </div>
              <span className="self-center font-bold">:</span>
              <div
                ref={minuteRef}
                className="h-78 overflow-y-auto border rounded-md flex flex-col"
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const minute = padZero(i);
                  return (
                    <div
                      key={minute}
                      data-minute={minute}
                      className={`p-2 cursor-pointer text-center ${
                        tempMinute === minute
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setTempMinute(minute)}
                    >
                      {minute}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Button onClick={handleApply} className="w-full mb-4">
            Apply
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
