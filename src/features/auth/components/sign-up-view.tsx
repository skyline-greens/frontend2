"use client";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import {
   Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { register } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import Link from 'next/link'
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export const registerSchema =  z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number must be valid' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type TRegisterSchema = z.infer<typeof registerSchema>;



export default function SignUpViewPage() {

  const router = useRouter();
  const form = useForm<TRegisterSchema>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submitHandler = async (data: TRegisterSchema) => {
    try {
      console.log("data", data);
       await register(data);
      toast.success("Sign up successful", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      setTimeout(() => {
        router.replace("/auth/sign-in");
      }, 2000);
    } catch (e: any) {
      toast.error("Sorry, there was an error.", {
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
        <Card className="mx-auto max-w-sm p-4">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="space-y-8"
      >

<div className="grid gap-4">

                      <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="name">Full Name</FormLabel>
                                <FormControl>
                                  <Input id="name" placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
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
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="phone">Phone Number</FormLabel>
                                <FormControl>
                                  <PhoneInput {...field} defaultCountry="DZ"/>
                                  {/* <Input
                                    id="phone"
                                    placeholder="555-123-4567"
                                    type="tel"
                                    autoComplete="tel"
                                    {...field}
                                  /> */}
                                </FormControl>
                                <FormMessage />
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
             <PasswordInput
                                id="password"
                                placeholder="******"
                                autoComplete="new-password"
                                {...field}
                              />
                </FormControl>
                <FormMessage className=" text-red-800 text-right font-light" />
              </FormItem>
            )}
          />

                     <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="confirmPassword">
                                  Confirm Password
                                </FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    id="confirmPassword"
                                    placeholder="******"
                                    autoComplete="new-password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
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
            Sign up
          </Button>

                          </div>

</div>
      </form>
    </Form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="underline">
  Login
</Link>
              </div>
    </CardContent>

    </Card>


        </div>
      </div>
    </div>
  );
}
