import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios.get("/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Orders</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Date
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Recipient
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Status
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Total Items
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {order.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        order.paid
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paid ? "PAID" : "PENDING"}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {order.line_items?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                  </td>
                </tr>
              ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}