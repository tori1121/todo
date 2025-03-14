import { User } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useNavigate } from "@remix-run/react";

interface IProps {
  user: User;
}

export const Header = ({ user }: IProps) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <header className="bg-green-500 h-10 flex justify-center items-center px-6 w-full">
      <h1 className="text-xl text-white">Todo Application</h1>
      <div className="flex-1" />
      <Popover>
        <PopoverTrigger>
          <p className="text-white">{user?.name}</p>
        </PopoverTrigger>
        <PopoverContent>
          <Button variant="outline" onClick={handleLogout} className="w-full">
            ログアウト
          </Button>
        </PopoverContent>
      </Popover>
    </header>
  );
};
