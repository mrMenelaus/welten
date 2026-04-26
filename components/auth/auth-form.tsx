"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    email: z.email("Недействительный email"),
    name: z.string().nonempty("Не должно быть пустым"),
    password: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Пароли не совпадают",
  });

const loginSchema = z.object({
  email: z.email("Недействительный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

export function AuthForm() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Войдите в свой профиль</CardTitle>
        <CardDescription>
          Получите уникальный пользовательский опыт
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="login">Войти</TabsTrigger>
            <TabsTrigger value="register">Зарегистрироваться</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function RegisterForm() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<z.infer<typeof registerSchema>>({
    defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await authClient.signUp.email(
      { ...data },
      {
        onSuccess: () => {
          router.push("/me");
        },
      },
    );
  });

  return (
    <form id="register" onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Ваше имя</FieldLabel>
              <Input
                {...field}
                id="name"
                name="name"
                aria-invalid={fieldState.invalid}
                placeholder="Иван"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Почта</FieldLabel>
              <Input
                {...field}
                id="email"
                name="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@gmail.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Введите пароль
              </FieldLabel>
              <Input
                {...field}
                id="password"
                name="password"
                aria-invalid={fieldState.invalid}
                placeholder="*****"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">
                Повторите пароль
              </FieldLabel>
              <Input
                {...field}
                id="confirm-password"
                name="confirm-password"
                aria-invalid={fieldState.invalid}
                placeholder="*****"
                autoComplete="off"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button size="lg" type="submit">
          Зарегистрироваться
        </Button>
      </FieldGroup>
    </form>
  );
}

export function LoginForm() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await authClient.signIn.email(
      { ...data },
      {
        onSuccess: () => {
          router.push("/me");
        },
      },
    );
  });

  return (
    <form id="register" onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Почта</FieldLabel>
              <Input
                {...field}
                id="email"
                name="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@gmail.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Введите пароль
              </FieldLabel>
              <Input
                {...field}
                id="password"
                name="password"
                aria-invalid={fieldState.invalid}
                placeholder="*****"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button size="lg" type="submit">
          Войти
        </Button>
      </FieldGroup>
    </form>
  );
}
