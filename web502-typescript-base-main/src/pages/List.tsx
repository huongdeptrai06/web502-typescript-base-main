import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

function ListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  // GET ALL
  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/products");
        // backend trả: { data: { data: [...] } }
        setProducts(data.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Không tải được danh sách!");
      }
    };
    getAll();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này không?")) return;

      await axios.delete(`http://localhost:3000/api/products/${id}`);

      setProducts(products.filter((product) => product._id !== id));

      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Price</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">
                  {item._id}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {item.name}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {item.price}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  <Link
                    to={`/edit/${item._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded inline-block"
                  >
                    Sửa
                  </Link>
                  <button
                    className="px-3 py-1 ml-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(item._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ListPage;
