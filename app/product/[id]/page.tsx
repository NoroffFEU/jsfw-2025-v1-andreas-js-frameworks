import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductDetails from "../../../components/ProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-20 px-6">
          <ProductDetails id={id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
