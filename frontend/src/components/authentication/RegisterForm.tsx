import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"

import authApi from "@/services/authentication/apiAuthentication";  
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const RegisterSchema = z.object({
    firstName: z.string().min(1, { message: "Họ không được để trống." }),
    lastName: z.string().min(1, { message: "Tên không được để trống." }),
    username: z.string().min(3, { message: "Tên người dùng phải có ít nhất 3 ký tự." }),
    email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
    password: z.string().min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"], // Gán lỗi vào trường confirmPassword
});

const RegisterForm = () => {
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {isSubmitting} = form.formState;

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setSuccessMessage(null);
        try{
            await authApi.register(values)
            setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");

            setTimeout(() => {
                navigate("/verify", { state: { email: values.email } });
            }, 3000);
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
            form.setError("root", { message: errorMessage });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
            <CardDescription>
              Điền thông tin dưới đây để bắt đầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage ? (
              <div className="p-4 text-center text-green-800 bg-green-100 rounded-md">
                <h3 className="font-bold">Thành công!</h3>
                <p>{successMessage}</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ</FormLabel>
                        <FormControl><Input placeholder="Nguyễn" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl><Input placeholder="Văn A" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người dùng</FormLabel>
                        <FormControl><Input placeholder="nguyenvana" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="example@email.com" {...field} type="email" disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  
                  {form.formState.errors.root && (
                    <FormMessage className="text-center">
                      {form.formState.errors.root.message}
                    </FormMessage>
                  )}
    
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng ký
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div> 
    )
}

export default RegisterForm;