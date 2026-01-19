import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Course = {
  id: number;
  name: string;
  category: string;
  teacher: string;
};

function AddPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    teacher?: string;
    category?: string;
  }>({});
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    name: "",
    category: "Chuyên ngành",
    teacher: "",
  });

  const categories = ["Đại cương", "Cơ sở", "Chuyên ngành"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên khóa học";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Tên khóa học phải có ít nhất 3 ký tự";
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = "Vui lòng nhập tên giáo viên";
    } else if (formData.teacher.trim().length < 3) {
      newErrors.teacher = "Tên giáo viên phải có ít nhất 3 ký tự";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn loại khóa học";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/courses", formData);
      toast.success("Thêm khóa học thành công!");
      navigate("/list");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm khóa học");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới khóa học</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Nhập tên khóa học"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.teacher
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Nhập tên giáo viên"
          />
          {errors.teacher && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <span>{errors.teacher}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại khóa học <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
              <span>{errors.category}</span>
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang thêm..." : "Thêm mới"}
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
