import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axios.get('/api/products?id='+id)
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

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : productInfo ? (
        <ProductForm {...productInfo} />
      ) : (
        <div className="text-center text-gray-500 py-8">
          Product not found
        </div>
      )}
    </Layout>
  );
}