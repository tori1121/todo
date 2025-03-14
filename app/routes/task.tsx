import { Link, Outlet, useActionData, useLoaderData } from "@remix-run/react";
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
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import Calendar from "~/components/TaskCalender";

export async function loader() {
  const user = await prisma.user.findUnique({
    where: { id: "1" },
  });

  const signinUser = user || { id: "1", name: "仮ユーザ", siinId: "9999" };

  const tasks = await prisma.task.findMany({
    where: {
      userId: signinUser.id,
      isDeleted: false,
    },
  });

  return { user: signinUser, tasks };
}

export default function TaskPage() {
  const { user, tasks } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const StatusLabel = (status: string) => {
    if (status === "todo") {
      return "未着手";
    } else if (status === "doing") {
      return "進行中";
    } else if (status === "done") {
      return "完了";
    } else {
      return "不明";
    }
  };

  return (
    <div className="h-screen">
      <Header user={user} />
      <div className="h-[calc(100vh-40px)] flex flex-row gap-4 p-4 bg-slate-100">
        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="h-1/2 w-full">
            <ScrollArea className="h-[45vh]">
              <div className="mb-2">
                <Link to={"add"}>
                  <Button variant="outline">
                    <PlusCircle className="w-5 h-5" />
                    タスクを追加する
                  </Button>
                </Link>
              </div>
              <Table className="border rounded-md shadow-md bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>進捗</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>期間</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="">
                        {StatusLabel(task.status)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        {format(task.startDate, "YYYY.MM.DD")}
                      </TableCell>
                      <TableCell>
                        <Link to={task.id}>
                          <Button variant="link" className="text-blue-600">
                            詳細を表示
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <div className="h-1/2 w-full">
            <Outlet />
          </div>
        </div>
        <div className="w-1/2 h-full">
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
