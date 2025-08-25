import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/context/authentication/AuthContext";
import authApi from "@/services/authentication/apiAuthentication";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

const verifySchema = z.object({
    code: z.string().length(6, "Code must be 6 characters"),
})

const VerifyForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth()!;

    const email = location.state?.email;
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    })

    const {isSubmitting} = form.formState;

    useEffect(() => {
        if (!email) {
            console.error("Không tìm thấy email để xác thực. Vui lòng thử đăng ký lại.");
            navigate("/register");
        }
    }, [email, navigate]);

    async function onSubmit(values: z.infer<typeof verifySchema>) {
        try{
            const response = await authApi.verify(email, values.code);
            if (response.data?.token){
                login(response.data);
                navigate("/");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
            form.setError("root", { message: errorMessage });
        }
    }

    if(!email) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                <CardTitle className="text-2xl">Xác thực tài khoản</CardTitle>
                <CardDescription>
                    Một mã OTP đã được gửi đến <span className="font-bold">{email}</span>.
                    <br />
                    Vui lòng nhập mã đó vào đây.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <FormLabel>Mã OTP</FormLabel>
                            <FormControl>
                            <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {form.formState.errors.root && (
                        <FormMessage className="text-center">
                        {form.formState.errors.root.message}
                        </FormMessage>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xác thực
                    </Button>
                    </form>
                </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                    Không nhận được mã?{" "}
                    {/* TODO: Thêm logic gọi API sendCode ở đây */}
                    <button type="button" className="font-medium text-primary hover:underline">
                        Gửi lại mã
                    </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default VerifyForm;