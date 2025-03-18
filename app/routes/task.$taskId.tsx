import { format } from "@formkit/tempo";
import { Status } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { prisma } from "~/lib/prisma";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("タスクが見つかりません");
  }

  const users = await prisma.user.findMany({});

  return { task, users };
}

export default function TaskDetailsPage() {
  const { task, users } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  return (
    <Dialog defaultOpen onOpenChange={() => navigate(-1)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>

        <Form method="post">
          {/* Display Task Info */}
          <div className="space-y-2">
            <div>
              <strong>担当者:</strong>
              <Select name="user" defaultValue={task.userId ?? ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="進捗を選択" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <strong>開始日:</strong>{" "}
              <Input
                name="startDate"
                type="date"
                defaultValue={format(new Date(task.startDate), "YYYY-MM-DD")}
              />
            </div>
            <div>
              <strong>終了日:</strong>{" "}
              <Input
                name="endDate"
                type="date"
                defaultValue={format(new Date(task.endDate), "YYYY-MM-DD")}
              />
            </div>
            <div>
              <strong>ステータス:</strong>
              <Select name="status" defaultValue={task.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="進捗を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">未着手</SelectItem>
                  <SelectItem value="DOING">作業中</SelectItem>
                  <SelectItem value="DONE">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              name="description"
              placeholder="メモ記載"
              defaultValue={task.description ?? ""}
              className="h-[150px] resize-none"
            />

            <DialogFooter className="flex flex-row justify-between">
              <Button
                type="submit"
                name="delete"
                value="true"
                className="text-red-600 hover:text-red-700"
                variant="outline"
              >
                削除
              </Button>
              <Button type="submit">変更を保存</Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const user = formData.get("user") as string;
  const status = formData.get("status") as Status;
  const isDeleled = formData.get("delete") === "true";
  const description = formData.get("description") as string;

  await prisma.task.update({
    where: {
      id: params.taskId,
    },
    data: {
      status,
      userId: user ?? null,
      description,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      isDeleted: isDeleled,
    },
  });

  return redirect("../");
}
