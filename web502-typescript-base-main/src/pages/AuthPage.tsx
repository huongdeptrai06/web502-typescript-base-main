import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  isLogin?: boolean;
};

    const authSchema = z.object({
    username: z.string().min(5, "Username phải > 3 ký tự").optional().or(z.literal('')),
    email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    password: z.string().min(7, "Password phải > 6 ký tự"),
    confirmPassword: z.string().optional(),
    }).refine((data) => {
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
    }, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof authSchema>;

function AuthPage({ isLogin }: Props) {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        const { data } = await axios.post("http://localhost:3000/login", {
          email: values.email,
          password: values.password,
        });
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        nav("/list");
      } else {
        await axios.post("http://localhost:3000/register", values);
        toast.success("Đăng ký thành công");
        nav("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {!isLogin && (
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              {...register("username")}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
<label className="block font-medium mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {!isLogin && (
          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;