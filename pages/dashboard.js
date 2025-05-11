import Layout from "@/components/Layout";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data

    // Fetch dashboard stats
    const fetchStats = axios.get("/api/dashboard-stats").then((response) => {
      setStats(response.data);
    });

    // Fetch recent orders
    const fetchOrders = axios.get("/api/orders?limit=5").then((response) => {
      setRecentOrders(response.data);
    });

    // Fetch recent reviews
    const fetchReviews = axios.get("/api/reviews?limit=5").then((response) => {
      setRecentReviews(response.data);
    });

    // Wait for all data to be fetched
    Promise.all([fetchStats, fetchOrders, fetchReviews]).finally(() => {
      setLoading(false); // Set loading to false after data is fetched
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
      <div className="text-2xl font-bold mb-4 bg-white text-gray-700 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        Hello, {session?.user?.name}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Products</h3>
          <p className="text-2xl font-bold text-cyan-600">{stats.products || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
          <p className="text-2xl font-bold text-cyan-600">{stats.orders || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
          <p className="text-2xl font-bold text-cyan-600">{stats.reviews || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <p className="text-2xl font-bold text-cyan-600">${stats.revenue || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Date
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Customer
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-gray-600 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reviews</h2>
        <ul>
          {recentReviews.map((review) => (
            <li key={review._id} className="mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">{review.name}</span> rated{" "}
                <span className="font-semibold">{review.rating}/5</span>
              </p>
              <p className="text-gray-500">{review.notes}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm mt-6"
      >
        Sign Out
      </button>
    </Layout>
  );
}