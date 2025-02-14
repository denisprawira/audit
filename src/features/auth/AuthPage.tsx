"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authValidationSchema } from "@/features/auth/validators/AuthValidator";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import supabaseClient from "@/features/auth/utils/SupabaseClient";
import toast from "react-hot-toast";

export const Auth = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: yupResolver(authValidationSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FieldValues) => {
    setIIsLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setIIsLoading(false);
      toast.error(error.message);
    } else {
      setIIsLoading(false);
      toast.success("Login successful");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 bg-black   flex flex-col justify-between p-6 md:p-8">
        <img
          alt="PSM logo"
          src={"/psm.png"}
          className="w-14 h-14 object-contain mb-4 sm:mb-0 "
        />
        <div className="text-white mb-6 md:mb-0">
          <p className="text-base md:text-lg mb-2">
            "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim
            ad minim veniam."
          </p>
          <p className="text-sm">chat gpt</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-primary bg-white dark:bg-gray-700/10 p-6 md:p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center">
            <h1 className={`text-xl md:text-2xl font-bold mb-2 `}>
              Welcome back
            </h1>
            <p className="text-gray-600 mb-6 md:mb-8">
              Enter your email below to sign in
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="example@email.com"
                        className="max-sm:h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="max-sm:h-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute rounded-full right-2 top-1/2 transform -translate-y-1/2 "
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full max-sm:h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {"Loading..."}
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs md:text-sm text-gray-600 mt-6 md:mt-8 text-center">
            By clicking continue, you agree to our <br />
            <a className="underline cursor-pointer">
              Terms of Service
            </a> and <a className="underline cursor-pointer">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
