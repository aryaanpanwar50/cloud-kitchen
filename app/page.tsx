import { MenuPage } from "@/components/menu/menu-page";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/landing");
  }

  return <MenuPage />;
}
