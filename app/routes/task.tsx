import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { prisma } from "~/lib/prisma";
import { format } from "@formkit/tempo";
import { Button } from "~/components/ui/button";
import { Ellipsis, PlusCircle } from "lucide-react";
import Calendar from "~/components/TaskCalender";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Status } from "@prisma/client";

export async function loader() {
  const tasks = await prisma.task.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      User: true,
    },
  });

  const sections = await prisma.section.findMany({
    where: {
      isDeleted: false,
    },
  });

  return { sections, tasks };
}

export default function TaskPage() {
  const { sections, tasks } = useLoaderData<typeof loader>();

  const StatusLabel = (status: Status) => {
    if (status === "TODO") {
      return "未着手";
    } else if (status === "DOING") {
      return "進行中";
    } else if (status === "DONE") {
      return "完了";
    } else {
      return "不明";
    }
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="h-[calc(100vh-48px)] flex flex-row gap-4 bg-indigo-100">
        <Outlet />
        <div className="w-1/2 h-full flex flex-col gap-4 p-4">
          <div className="w-full">
            <Link to={`add/section`}>
              <Button variant="outline" className="">
                <PlusCircle className="w-5 h-5" />
                セクションを追加する
              </Button>
            </Link>
            <ScrollArea className="h-[88vh] pb-10 pr-4">
              <div className="flex flex-col gap-8">
                {sections.map((section) => {
                  const taskList = tasks.filter(
                    (item) => item.sectionId === section.id
                  );
                  return (
                    <div className="flex flex-col gap-2" key={section.id}>
                      <div className="flex flex-row items-center gap-2">
                        <p className="font-bold">{section.name}</p>
                        <Link to={`sectionedit/${section.id}`}>
                          <Button size="icon" variant="ghost">
                            <Ellipsis className="w-5 h-5" />
                          </Button>
                        </Link>
                        <div className="flex-1" />
                        <div className="">
                          <Link to={`add/${section.id}`}>
                            <Button variant="outline">
                              <PlusCircle className="w-5 h-5" />
                              タスクを追加する
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <Table className="border rounded-md shadow-md bg-white">
                        <TableHeader>
                          <TableRow>
                            <TableHead>タイトル</TableHead>
                            <TableHead>担当者</TableHead>
                            <TableHead>進捗</TableHead>
                            <TableHead>期間</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskList.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-medium">
                                {task.title}
                              </TableCell>
                              <TableCell className="">
                                {task.User?.name}
                              </TableCell>
                              <TableCell className="">
                                {StatusLabel(task.status)}
                              </TableCell>
                              <TableCell>
                                {format(task.startDate, "YYYY.MM.DD")}~
                                {format(task.endDate, "YYYY.MM.DD")}
                              </TableCell>
                              <TableCell>
                                <Link to={task.id}>
                                  <Button
                                    variant="link"
                                    className="text-blue-600"
                                  >
                                    詳細を表示
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="w-1/2">
          <div className="p-4">
            <Calendar tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action() {
  return null;
}
