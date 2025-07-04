"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthRoutes, Route } from "@/routes/routes";
import { useState } from "react";

import { useLogin } from "@/api/mutations/useLogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const loginMutation = useLogin();
  const SignUp: Route | undefined = AuthRoutes.find(
    (route) => route.title === "Sign Up"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ username, password });
      router.push("/home");
    } catch (error) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance text-main-orange'>
                  Telemetrics Project
                </h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your account
                </p>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder=''
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a
                    href='#'
                    className='ml-auto text-sm underline-offset-2 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type='submit'
                className='w-full bg-main-orange hover:bg-main-orange-dark'
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

              <div className='text-center text-sm'>
                Don&apos;t have an account?{" "}
                {SignUp && (
                  <a
                    key={SignUp.url}
                    href={SignUp.url}
                    className='text-main-orange underline underline-offset-4'
                  >
                    {SignUp.title}
                  </a>
                )}
              </div>
            </div>
          </form>
          <div className='hidden md:flex bg-muted relative h-full items-center justify-center'>
            <Image
              src='/TechAdvise-Gray.png'
              alt='Image'
              width={700 / 2.7}
              height={692 / 2.7}
              className='dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
