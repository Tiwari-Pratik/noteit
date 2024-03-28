
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7xtr51Y4fnO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "../../../../auth";
import { logoutUser } from "@/lib/actions";

const Navbar = async () => {
  const session = await auth();
  const isLoggedIn = session?.user;

  // const clickHandler = async () => {
  //   await logoutUser();
  // };
  return (
    <nav
      key="1"
      className="fixed inset-x-0 top-0 z-50 mb-8 bg-white/90 shadow-sm dark:bg-gray-700/90"
    >
      <div className="container px-4 md:px-6">
        <div className="flex h-14 items-center">
          <Link href="/">
            <span className="text-lg font-bold text-primary">.noteIt</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
          </div>
          {isLoggedIn && (
            <form action={logoutUser}>
              <Button className="ml-4">Signout</Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
