import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect } from "react";

export default function Products() {
    useEffect(() => {
        axios.get('/api/products').then(response => {
            console.log(response.data);
        })
    }, []);
    return (
        <Layout>
            <Link className="bg-cyan-800 text-sm text-white rounded-md py-1 px-2 " href={'/products/new'}>Add new product</Link>
        </Layout>
    )
}