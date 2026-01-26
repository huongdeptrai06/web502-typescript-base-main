import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const validateSchema = z.object({
  name: z
    .string()
    .min(1,"Vui lòng nhập tên Khóa Học")
    .min(3, "Tên khóa học phải có ít nhất 3 ký tự")
    .max(21, "Tên khóa học không được vượt quá 21 ký tự"),

  credit: z
    .number("Bắt buộc phải kiểu số")
    .min(1, "Tín chỉ phải >= 1")
    .max(10, "Tín chỉ không được > 10"),

  category: z.string().min(1, "Vui lòng chọn loại khóa học"),

  teacher: z
    .string()
    .min(1,"Vui lòng nhập tên giáo viên")
    .min(2, "Tên giáo viên phải có ít nhất 2 ký tự")
    .max(21, "Tên giáo viên không được vượt quá 21 ký tự"),
});

type FormValues = z.infer<typeof validateSchema>;

function AddPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(validateSchema),
    defaultValues: {
      name: "",
      credit: 3,
      category: "Chuyên ngành",
      teacher: "",
    },
  });

  const categories = ["Đại cương", "Cơ sở", "Chuyên ngành"];

  useEffect(() => {
    if (!id) return;

    const getDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/courses/${id}`
        );
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };

    getDetail();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        await axios.put(`http://localhost:3000/courses/${id}`, values);
        toast.success("Cập nhật khóa học thành công");
      } else {
        await axios.post("http://localhost:3000/courses", values);
        toast.success("Thêm khóa học thành công");
      }
      navigate("/list");
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Cập nhật khóa học" : "Thêm mới khóa học"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Tên khóa học *</label>
          <input
            {...register("name")}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Tín chỉ *</label>
          <input
            type="number"
            {...register("credit", { valueAsNumber: true })}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.credit ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.credit && (
            <p className="text-red-500 text-sm">{errors.credit.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Giáo viên *</label>
          <input
            {...register("teacher")}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.teacher ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.teacher && (
            <p className="text-red-500 text-sm">{errors.teacher.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Loại khóa học *</label>
          <select
            {...register("category")}
            className={`w-full border px-3 py-2 rounded-lg ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : id
              ? "Cập nhật"
              : "Thêm mới"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/list")}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPage;
