import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axios.get('/api/products?id=' + id)
      .then(response => {
        setProductInfo(response.data);
      })
      .catch(error => {
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  function goBack() {
    router.push('/products');
  }

  async function deleteProduct() {
    try {
      setDeleting(true);
      await axios.delete('/api/products?id=' + id);
      goBack();
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : productInfo ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Do you really want to delete &quot;{productInfo?.title}&quot;?
            </h1>
            <div className="flex gap-4">
              <button
                onClick={deleteProduct}
                disabled={deleting}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition"
                onClick={goBack}
                disabled={deleting}
              >
                No, Go Back
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Product not found
          </div>
        )}
      </div>
    </Layout>
  );
}