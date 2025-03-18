import { addDay } from "@formkit/tempo";
import { Label } from "@radix-ui/react-label";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { prisma } from "~/lib/prisma";

export default function TaskAddPage() {
  const data = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) return;
    if (data.success) {
      navigate(-1);
    }
  }, [data]);
  return (
    <Dialog defaultOpen={true} onOpenChange={() => navigate(-1)}>
      <DialogContent className="sm:max-w-[425px]">
        <Form method="post">
          <DialogHeader>
            <DialogTitle>タスクの追加</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                タイトル
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                placeholder="入力して下さい"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="period" className="text-right">
                期限
              </Label>
              <Input
                id="period"
                name="period"
                type="date"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">追加</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const title = formData.get("title") as string;
  const period = formData.get("period") as string;

  await prisma.task.create({
    data: {
      title: title,
      status: "TODO",
      sectionId: params.section,
      endDate: !period ? addDay(new Date(), 7) : new Date(period),
    },
  });

  return { success: true };
}
