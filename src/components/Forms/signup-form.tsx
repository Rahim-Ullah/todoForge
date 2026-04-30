import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useForm} from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { RegisterPayLoad } from "../../types/auth.types";
import { useAuth } from "../../hooks/useAuth";


export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayLoad>({
  });
        const {register : signUp} =useAuth()
              const navigate = useNavigate()
      
          const onSubmit = async (data: RegisterPayLoad) => {
            const response = await signUp({
              username: data.username.toLowerCase().replace(/\s+/g, ""),
              email: data.email,
              password: data.password,
            });

            console.log(response);
            console.log(response.data)

              if (response?.statusCode === 200 || response?.success ) {

              navigate("/dashboard");
            }
          }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="username">User Name</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  {...register("username", { required: "User Name is required" })}
                />
                {errors.username && <span className="text-xs text-destructive">{errors.username.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                />
                {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
              </Field>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </FieldGroup>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
