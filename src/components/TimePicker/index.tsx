import * as React from "react";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function TimePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [tempHour, setTempHour] = React.useState("00");
  const [tempMinute, setTempMinute] = React.useState("00");
  const [inputValue, setInputValue] = React.useState(value || "");

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value && isValidTime(value)) {
      const [h, m] = value.split(":");
      setTempHour(h);
      setTempMinute(m);
      setInputValue(value);
    } else {
      setInputValue(value || "");
    }
  }, [value]);

  React.useEffect(() => {
    if (open && hourRef.current) {
      const selectedHour = hourRef.current.querySelector(
        `[data-hour="${tempHour}"]`
      );
      if (selectedHour) {
        selectedHour.scrollIntoView({ block: "center" });
      }
    }
    if (open && minuteRef.current) {
      const selectedMinute = minuteRef.current.querySelector(
        `[data-minute="${tempMinute}"]`
      );
      if (selectedMinute) {
        selectedMinute.scrollIntoView({ block: "center" });
      }
    }
  }, [open, tempHour, tempMinute]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidTime(newValue)) {
      const [h, m] = newValue.split(":");
      setTempHour(h);
      setTempMinute(m);
      onChange?.(newValue);
    }
  };

  const handleApply = () => {
    const newTime = `${tempHour}:${tempMinute}`;
    setInputValue(newTime);
    onChange?.(newTime);
    setOpen(false);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="time"
        value={inputValue}
        placeholder="HH:MM"
        className="bg-background pr-10"
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
            id="time-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <Clock className="size-3.5" />
            <span className="sr-only">Select time</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <div className="flex items-stretch gap-2 mb-4">
            <div
              ref={hourRef}
              className="h-40 overflow-y-auto border rounded-md flex flex-col"
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
              className="h-40 overflow-y-auto border rounded-md flex flex-col"
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
          <Button onClick={handleApply} className="w-full">
            Apply
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
