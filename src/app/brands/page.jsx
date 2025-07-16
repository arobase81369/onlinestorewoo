import BrandSlider from "@/components/BrandSlider";
import Breadcrumbs from "@/components/Breadcrumbs";


export default function Brands() {

    return(
        <div>
              <div className="max-w-7xl mx-auto px-3 pt-4">
            <Breadcrumbs />
            </div>
            <BrandSlider />
        </div>
    )
}