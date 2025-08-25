import {useForm } from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"

import { useAuth } from "@/context/authentication/AuthContext";
import authApi from "@/services/authentication/apiAuthentication";

import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const LoginSchema = z.object({
    email : z.string().email({
        message: "Địa chỉ email không hợp lệ",}),
    password: z.string().min(8, {
        message: "Mật khẩu phải có ít nhất 8 ký tự",
    }),
})

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth()!;

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        try {
            const response = await authApi.login(values)
         
            if(response.data?.token) {
                login(response.data);
                navigate("/");
            } else{
                form.setError("root", { message: "Phản hồi đăng nhập không hợp lệ." });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
            form.setError("root", { message: errorMessage });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 4. Sử dụng component Form từ thư viện UI */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="example@email.com" 
                          {...field} 
                          type="email"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Mật khẩu</FormLabel>
                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          {...field} 
                          type="password"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                {/* Hiển thị lỗi chung của form (ví dụ: sai mật khẩu) */}
                {form.formState.errors.root && (
                  <FormMessage className="text-center">
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
  
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng nhập
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
}

export default LoginForm;