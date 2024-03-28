
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XmAx6TDcqWY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginState } from "@/lib/schema";
import { useFormState } from "react-dom";
import { loginUser } from "@/lib/actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubmitButton from "./submitButton";

export default function Login() {
  const initialState: LoginState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(loginUser, initialState);

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const router = useRouter();

  if (urlError) {
    router.replace(`/login-error?error=${urlError}`);
  }


  return (
    <div
      key="1"
      className="flex flex-col min-h-screen items-center justify-center space-y-4 px-4"
    >
      <div className="w-full max-w-sm space-y-4">
        <Card key="1">
          <CardHeader className="space-y-2">
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form aria-describedby="custom-error-message" action={dispatch}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                  aria-describedby="email-error"
                />
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors?.email?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  placeholder="********"
                  aria-describedby="password-error"
                />
              </div>
              <div id="password-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password &&
                  state.errors?.password?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
              <Button variant="link" size="sm">
                <Link href="/reset-password">Forgot password?</Link>{" "}
              </Button>
              <div
                id="custom-error-message"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.message && (
                  <p className="mt-2 text-sm text-red-500">{state.message}</p>
                )}
              </div>
              <CardFooter className="mt-8 flex gap-2">
                {/*               <Button type="submit" className="flex-1">
                  Sign in
                </Button>
                */}
                <SubmitButton />
              </CardFooter>
            </form>

            <CardFooter>
              <p className="text-sm">
                Don't have an account. Register{" "}
                <span>
                  <Link
                    href="/register"
                    className="ml-2 px-4 py-2 bg-primary text-sm text-white rounded-md"
                  >
                    Here
                  </Link>
                </span>
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


