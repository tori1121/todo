import React, { useEffect, useState } from "react";
import { Task } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Earth } from "lucide-react";

interface CalendarProps {
  tasks: Task[];
}

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [startDayOfWeek, setStartDayOfWeek] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start, end });
    setDays(daysInMonth);

    setStartDayOfWeek(getDay(start));
  }, [currentDate]);

  const handleTaskClick = (id: string) => {
    navigate(`/task/${id}`);
  };

  return (
    <ScrollArea className="h-[90vh]">
      <div className="space-y-4 border rounded-md shadow-md p-4 bg-white">
        <div className="flex justify-between items-center">
          <Button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1
                )
              )
            }
            className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
          >
            Prev
          </Button>
          <h2 className="text-2xl font-bold">
            {format(currentDate, "yyyy年MM月")}
          </h2>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1
                )
              )
            }
            className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
            <div key={index} className="text-center font-semibold">
              {day}
            </div>
          ))}

          {/* 月初の日に対応する曜日を考慮して、空白を表示 */}
          {Array.from({ length: startDayOfWeek }).map((_, index) => (
            <div key={index} className="text-center"></div>
          ))}

          {days.map((day, index) => {
            const dayTasks = tasks.filter(
              (task) =>
                format(task.endDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            );
            return (
              <div
                key={index}
                className="text-center p-2 border rounded-sm min-h-28"
              >
                <div className="text-sm">{format(day, "d")}</div>
                {dayTasks.map((task, taskIndex) => (
                  <TaskButton
                    key={taskIndex}
                    taskName={task.title}
                    onClick={() => handleTaskClick(task.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Calendar;

interface TaskButtonProps {
  taskName: string;
  onClick: () => void;
}

const TaskButton: React.FC<TaskButtonProps> = ({ taskName, onClick }) => {
  return (
    <>
      <button
        className="hidden lg:block bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full text-sm"
        onClick={onClick}
      >
        {taskName}
      </button>
      <button
        className="block lg:hidden bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        onClick={onClick}
      >
        <Earth />
      </button>
    </>
  );
};
