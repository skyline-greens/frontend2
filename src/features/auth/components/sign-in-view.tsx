"use client";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/user";
import { TPayload } from "@/types";
import Link from 'next/link';
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6,"Invalid password"),
});

export type TAuthSchema = z.infer<typeof authSchema>;

export default function SignInViewPage() {
  const { setUser } = useUserStore(state => ({
    setUser: state.setUser,
  }))
  const router = useRouter();
  const form = useForm<TAuthSchema>({
    mode: "onChange",
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const submitHandler = async (data: TAuthSchema) => {
    try {
      const response = await login(data);

      const accessToken = response["access"]
      const payload = JSON.parse(atob(accessToken.split(".")[1])) as TPayload

      setUser(payload)
      toast.success("Login successful", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      setTimeout(() => {
        router.replace("/dashboard ");
      }, 2000);
    } catch (e: any) {
      toast.error("Sorry, no user was found with these credentials.", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    }
  };



  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className="relative z-10 flex items-center gap-3 mt-2 ml-2">
          <Image
            src='/images/logo.png'
            alt='Company Logo'
            width={60}
            height={60}
            className='my-2'
            priority
          />
          <span className="text-2xl font-bold text-white">Verdant</span>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
                  <Card className="mx-auto max-w-sm
     min-h-96 p-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Login
                    </CardTitle>
                    <CardDescription>
                      Login to your account by filling out the form below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
        <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col gap-8 max-w-[380px]"
      >
<div
className="grid gap-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" flex flex-col gap-2">
                <FormLabel> Email  </FormLabel>
                <FormControl
                  className=" border-gray-500 border-2 px-3 rounded-md py-2"
                 
                >
                  <Input  placeholder="joe@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage className=" text-red-800 text-right font-light" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className=" flex flex-col gap-2">
                <FormLabel>Password</FormLabel>
                <FormControl
                  className="border-gray-500 border-2 px-3 rounded-md py-2"
                
                >
                  <Input   placeholder="YTg1NjVmMzQ=" type="password" {...field} />
                </FormControl>
                <FormMessage className=" text-red-800 text-right font-light" />
              </FormItem>
            )}
          />

                                    <div className="flex  justify-center">
                                    <Button
                      className="w-full bg-blue-600 text-white"
                      // disabled={loading}
                      type="submit"
                    >
                      {/* { "..." } */}
                      {/* {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
                      Sign In
                    </Button>
          
                                    </div>

</div>
      </form>
    </Form>
              <div className="mt-4 text-center text-sm">
              you don't have an account yet
                ?{' '}
                <Link href="/auth/sign-up" className="underline">
  Sign Up
</Link>
              </div>
    </CardContent>

    </Card>

        </div>
      </div>
    </div>
  );
}
