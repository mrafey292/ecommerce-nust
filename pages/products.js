import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        })
    }, []);
    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <Link
                        className="bg-cyan-800 text-sm text-white rounded-md py-2 px-4 hover:bg-cyan-700"
                        href={'/products/new'}
                    >
                        Add New Product
                    </Link>
                </div>
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-cyan-800 text-white">
                        <tr>
                            <th className="text-left py-3 px-4">Product Name</th>
                            <th className="text-left py-3 px-4">Price</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product._id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{product.title}</td>
                                    <td className="py-3 px-4">${product.price}</td>
                                    <td className="py-3 px-4 text-right">
                                        <Link
                                            className="bg-cyan-800 text-sm text-white rounded-md py-1 px-3 hover:bg-cyan-700 mr-2"
                                            href={'/products/edit/' + product._id}
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            className="bg-cyan-800 text-sm text-white rounded-md py-1 px-3 hover:bg-cyan-700"
                                            href={'/products/delete/' + product._id}
                                        >
                                            Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}