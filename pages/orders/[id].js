import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axios.get(`/api/orders?id=${id}`)
      .then((response) => {
        if (!response.data) {
          throw new Error("Order not found");
        }
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setError(error.message || "Failed to load order");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8">
          <button
            onClick={() => router.push("/orders")}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Orders
          </button>
          <div className="text-center text-red-600">
            {error || "Order not found"}
          </div>
        </div>
      </Layout>
    );
  }

  const totalAmount = order.line_items?.reduce(
    (sum, item) => sum + (item.quantity * item.price),
    0
  ) || 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => router.push("/orders")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Order Details
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.paid
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {order.paid ? "PAID" : "PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Order Info</h2>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  Shipping Details
                </h2>
                <div className="text-gray-600">
                  <p>{order.name}</p>
                  <p>{order.email}</p>
                  <p>{order.streetAddress}</p>
                  <p>
                    {order.city}, {order.postalCode}
                  </p>
                  <p>{order.country}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.line_items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-500">
                        Quantity: {item.quantity} x ${item.price?.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${((item.quantity * item.price) || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4">
                  <p className="font-medium text-lg">Total</p>
                  <p className="font-medium text-lg">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 