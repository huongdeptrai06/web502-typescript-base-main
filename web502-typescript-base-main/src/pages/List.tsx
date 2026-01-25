import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// type /interface
type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  // 1. state
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(1);
  // 2. call api

  useEffect(() => {
    // axios async await + try catch
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  const uniqueTeachers = Array.from(
    new Set(courses.map((course) => course.teacher)),
  ).sort();

  const filteredCourses = courses.filter((course) => {
    const matchesName = course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTeacher =
      selectedTeacher === "" || course.teacher === selectedTeacher;
    return matchesName && matchesTeacher;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex); 

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeacher]);

  // 3. xoa 1 item
  const handleDelete = async (id: number) => {
  try {
    const ok = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!ok) return;

    await axios.delete(`http://localhost:3000/courses/${id}`);
    setCourses(courses.filter((course) => course.id !== id));
    toast.success("Xóa khóa học thành công");
  } catch (error) {
    toast.error("Xóa thất bại");
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Tất cả giáo viên</option>
          {uniqueTeachers.map((teacher) => (
            <option key={teacher} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Teacher
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">
                    {item.id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.teacher}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex gap-2">
                      <Link
                        to={`/edit/${item.id}`}
                        className="px-3 py-1 text-sm bg-blue-400 text-white rounded hover:bg-blue-500 transition"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-500 border border-gray-300"
                >
                  Không tìm thấy kết quả nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border border-gray-300 rounded-lg ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListPage;
