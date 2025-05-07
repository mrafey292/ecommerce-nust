import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
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
                Paid
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Recipient
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Products
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        order.paid
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paid ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country}
                    <br />
                    {order.streetAddress}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {order.line_items.map((item, index) => (
                      <div key={index} className="mb-2">
                        <span className="font-medium">{item.title}</span> x{" "}
                        {item.quantity} @ ${item.price.toFixed(2)}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}