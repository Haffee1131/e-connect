"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
});

export default function Welcome() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (values) router.replace(`/chat?username=${values.username}`);
	}
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<h1 className="text-4xl font-bold mb-8">Welcome!</h1>
			<div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-sm">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-10"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xl font-semibold">
										Username
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Try your nickname [Haffee]"
											{...field}
											className="mt-1 text-md h-10"
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										This is your public display name
									</FormDescription>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full h-10 text-lg bg-black text-white hover:bg-gray-800"
						>
							Let's chat
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
