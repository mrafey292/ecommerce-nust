import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/products');
  }

  async function deleteProduct() {
    await axios.delete('/api/products?id=' + id);
    goBack();
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Do you really want to delete &quot;{productInfo?.title}&quot;?
        </h1>
        <div className="flex gap-4">
          <button
            onClick={deleteProduct}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition"
            onClick={goBack}
          >
            No, Go Back
          </button>
        </div>
      </div>
    </Layout>
  );
}