
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hTFeZMC1pkD
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
import { useFormState } from "react-dom";

import { registerUser } from "@/lib/actions";
import { RegisterState } from "@/lib/schema";


export default function Register() {
  const initialState: RegisterState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(registerUser, initialState);
  return (
    <div
      key="1"
      className="flex flex-col min-h-screen items-center justify-center space-y-4 px-4"
    >
      <div className="w-full max-w-sm space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Register</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form aria-describedby="custom-error-message" action={dispatch}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
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
                  placeholder="Enter your password"
                  required
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  type="password"
                  aria-describedby="confirmPassword-error"
                />
              </div>
              <div
                id="confirmPassword-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.confirmPassword &&
                  state.errors?.confirmPassword?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>

              <CardFooter className="mt-8 flex gap-2">
                <Button className="w-full" type="submit">
                  Register
                </Button>
              </CardFooter>
              <div
                id="custom-error-message"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.message && (
                  <p className="mt-2 text-sm text-red-500">{state.message}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
