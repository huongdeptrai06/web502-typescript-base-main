import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const validateSchema = z.object({
  name: z
    .string()
    .min(3, "Tên khóa học phải có ít nhất 3 ký tự")
    .max(100, "Tên khóa học không được vượt quá 100 ký tự"),
  credit: z
    .number({
    })
    .min(1, "Số tín chỉ phải từ 1 trở lên")
    .max(10, "Số tín chỉ không được vượt quá 10"),
  category: z.string().min(1, "Vui lòng chọn loại khóa học"),
  teacher: z
    .string()
    .min(2, "Tên giáo viên phải có ít nhất 2 ký tự")
    .max(50, "Tên giáo viên không được vượt quá 50 ký tự"),
});

type FormValues = z.infer<typeof validateSchema>;

function AddPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
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

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post("http://localhost:3000/courses", values);
      toast.success("Thêm khóa học thành công!");
      navigate("/list");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm khóa học");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới khóa học</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên khóa học */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Nhập tên khóa học"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Giáo viên */}
        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên <span className="text-red-500">*</span>
          </label>
          <input
            {...register("teacher")}
            type="text"
            id="teacher"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.teacher
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Nhập tên giáo viên"
          />
          {errors.teacher && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>{errors.teacher.message}</span>
            </p>
          )}
        </div>

        {/* Số tín chỉ */}
        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Số tín chỉ <span className="text-red-500">*</span>
          </label>
          <input
            {...register("credit", { valueAsNumber: true })}
            type="number"
            id="credit"
            min="1"
            max="10"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.credit
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Nhập số tín chỉ"
          />
          {errors.credit && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>{errors.credit.message}</span>
            </p>
          )}
        </div>

        {/* Loại khóa học */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại khóa học <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category")}
            id="category"
            className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>⚠</span>
              <span>{errors.category.message}</span>
            </p>
          )}
        </div>

        {/* Submit button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang thêm..." : "Thêm mới"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPage;