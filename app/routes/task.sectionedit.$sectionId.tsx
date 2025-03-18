import { Label } from "@radix-ui/react-label";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const section = await prisma.section.findUnique({
    where: { id: params.sectionId },
  });

  return { section };
}

export default function TaskAddPage() {
  const { section } = useLoaderData<typeof loader>();
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
            <DialogTitle>セクションの編集</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                セクション名
              </Label>
              <Input
                id="title"
                name="name"
                className="col-span-3"
                placeholder="入力して下さい"
                defaultValue={section?.name}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">編集</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const name = formData.get("name") as string;

  await prisma.section.update({
    where: {
      id: params.sectionId,
    },
    data: {
      name: name,
    },
  });

  return { success: true };
}
