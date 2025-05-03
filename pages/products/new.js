import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [gotoProducts, setGotoProducts] = useState(false);

    const router = useRouter();
    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/products', data);
        setGotoProducts(true);
    }
    if (gotoProducts) {
        return router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
                <div className="text-2xl font-bold mb-4 bg-white text-gray-700 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
                    New Product
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 text-sm mb-2" htmlFor="name">
                        Product Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Product Name" onChange={ev => setTitle(ev.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 font-regular leading-tight focus:outline-none focus:shadow-outline" id="price" type="text" placeholder="Price" onChange={ev => setPrice(ev.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Description" onChange={ev => setDescription(ev.target.value)}></textarea>
                </div>
                <button className="bg-cyan-800 hover:bg-cyan-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Add Product
                </button>
            </form>
        </Layout>
    )
}