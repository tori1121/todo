import { Button } from "./ui/button";
import { useNavigate } from "@remix-run/react";

export const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <header className="bg-indigo-800 h-12 flex justify-center items-center px-6 w-full">
      <h1 className="text-xl text-white">Todo Application</h1>
      <div className="flex-1" />
      <Button variant="outline" onClick={handleLogout} className="bg-slate-200 w-40">
        ログアウト
      </Button>
    </header>
  );
};
