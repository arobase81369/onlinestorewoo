import Breadcrumbs from "@/components/Breadcrumbs";
import ProductList from "@/components/productslist";


export default function Product() {

    return(
        <div>
              <div className="max-w-7xl mx-auto px-3 pt-4">
            <Breadcrumbs />
            </div>
            <ProductList />
        </div>
    )
}