import { Label } from "@radix-ui/react-label";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
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
            <DialogTitle>セクションの追加</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                セクション名
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                placeholder="入力して下さい"
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
  const name = formData.get("name") as string;

  await prisma.section.create({
    data: {
      name: name,
    },
  });

  return { success: true };
}
