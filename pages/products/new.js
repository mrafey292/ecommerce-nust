import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
    return (
        <Layout>
            <div className="text-2xl font-bold mb-4 bg-white text-gray-700 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
                New Product
            </div>
            <ProductForm />    
        </Layout>
    );
}