import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { DeleteIcon, Trash2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
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

  return { task };
}

export default function TaskDetailsPage() {
  const { task } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const handleClose = () => {
    navigate("../");
  };

  return (
    <Card className="h-[40vh]">
      <ScrollArea className="h-[40vh]">
        <Form method="post">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{task.title}</CardTitle>
            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              <X />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              name="description"
              placeholder="メモ記載"
              defaultValue={task.description ?? ""}
              className="h-[150px] resize-none"
            />
          </CardContent>
          <CardFooter className="flex flex-row justify-between items-center">
            <Button
              size="icon"
              type="submit"
              variant="ghost"
              name="delete"
              value="true"
            >
              <Trash2 className="text-red-600" />
            </Button>
            <Button type="submit">保存</Button>
          </CardFooter>
        </Form>
      </ScrollArea>
    </Card>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const isDeleled = formData.get("delete") === "true";
  const description = formData.get("description") as string;

  await prisma.task.update({
    where: {
      id: params.taskId,
    },
    data: {
      description,
      isDeleted: isDeleled,
    },
  });

  return null;
}
