import Breadcrumbs from "@/components/Breadcrumbs";
import CategoriesPage from "@/components/categories";


export default function Category() {

    return(
        <div>
            <div className="max-w-7xl mx-auto px-3 pt-4 pb-3">
            <Breadcrumbs />
            </div>
            <CategoriesPage />
        </div>
    )
}