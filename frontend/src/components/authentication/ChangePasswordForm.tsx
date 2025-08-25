import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import authApi from "@/services/authentication/apiAuthentication";
import { useAuth } from "@/context/authentication/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const ChangePasswordSchema = z.object({
    current_password: z.string().min(1, { message: "Mật khẩu hiện tại không được để trống." }),
    new_password: z.string().min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự." }),
    confirm_password: z.string(),
  }).refine(data => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirm_password"],
});

const ChangePasswordForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth()!;
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
        setSuccessMessage(null);
        try {
        
            const response = await authApi.changePassword(values);

            if (response.data?.token) {
                login(response.data);
            }
            
            setSuccessMessage("Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng sau giây lát.");
            
            setTimeout(() => {
                navigate('/profile/me');
            }, 3000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn.";
            form.setError("root", { message: errorMessage });
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
                    <CardDescription>
                        Để bảo mật, vui lòng không chia sẻ mật khẩu của bạn cho người khác.
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm">
                            <FormField control={form.control} name="current_password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                                    <FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="new_password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            <FormField control={form.control} name="confirm_password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                    <FormControl><Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            {form.formState.errors.root && (
                                <FormMessage>{form.formState.errors.root.message}</FormMessage>
                            )}
            
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Lưu thay đổi
                            </Button>
                        </form>
                    </Form>
                 )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ChangePasswordForm;