// src/components/authentication/ResetPasswordForm.tsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom"; // Thêm Navigate
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import authApi from "@/services/authentication/apiAuthentication";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

const ResetPasswordSchema = z.object({
    email: z.string().email(),
    code: z.string().min(6, { message: "Mã OTP phải có 6 ký tự." }),
    newPassword: z.string().min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự." }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
});

// Component con chứa logic chính
const ResetPasswordFormContent = ({ email }: { email: string }) => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: email,
            code: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
        setSuccessMessage(null);
        try {
            await authApi.resetPassword({
                email: values.email,
                code: values.code,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword
            });
            
            setSuccessMessage("Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
            form.setError("root", { message: errorMessage });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
                    <CardDescription>
                        Nhập mã OTP từ email và mật khẩu mới của bạn.
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
                                {/* ... form fields giống hệt như cũ ... */}
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} readOnly disabled className="bg-gray-100"/></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="code" render={({ field }) => (
                                    <FormItem className="flex flex-col items-center"><FormLabel>Mã OTP</FormLabel><FormControl><InputOTP maxLength={6} {...field}><InputOTPGroup>{[...Array(6)].map((_, i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup></InputOTP></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="newPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Mật khẩu mới</FormLabel><FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Xác nhận mật khẩu mới</FormLabel><FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                                )} />
                                {form.formState.errors.root && (<FormMessage className="text-center">{form.formState.errors.root.message}</FormMessage>)}
                                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Đặt lại mật khẩu</Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        <Link to="/login" className="font-medium text-primary hover:underline">Quay lại Đăng nhập</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

// Component "gác cổng"
const ResetPasswordForm = () => {
    const location = useLocation();
    const emailFromPreviousPage = location.state?.email;

    // Nếu không có email, render component Navigate để chuyển hướng ngay lập tức
    if (!emailFromPreviousPage) {
        return <Navigate to="/forget" replace />;
    }

    // Nếu có email, render form chính và truyền email vào
    return <ResetPasswordFormContent email={emailFromPreviousPage} />;
}


export default ResetPasswordForm;