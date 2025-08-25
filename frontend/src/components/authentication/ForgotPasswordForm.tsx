import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import authApi from "@/services/authentication/apiAuthentication";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"

const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
});

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
        setSuccessMessage(null);
        try{
            await authApi.forgotPassword(values.email);
            setSuccessMessage("Yêu cầu thành công! Vui lòng kiểm tra email để nhận mã OTP.");

            setTimeout(() => {
                navigate('/reset', { state: { email: values.email } });
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
            <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
            <CardDescription>
                Nhập địa chỉ email của bạn để nhận mã OTP
            </CardDescription>
            </CardHeader>
            <CardContent>
            {successMessage ? (
                <div className="p-4 text-center text-green-800 bg-green-100 rounded-md">
                    <h3 className="font-bold">Đã gửi!</h3>
                    <p>{successMessage}</p>
                </div>
            ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="example@email.com" {...field} type="email" disabled={isSubmitting}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {form.formState.errors.root && (
                    <FormMessage className="text-center">{form.formState.errors.root.message}</FormMessage>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi mã OTP
                    </Button>
                </form>
                </Form>
            )}
            </CardContent>
            <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                Quay lại Đăng nhập
                </Link>
            </p>
            </CardFooter>
        </Card>
    </div>
    )

}

export default ForgotPasswordForm;
