import Breadcrumbs from "@/components/Breadcrumbs";
import CartItemsnew from "@/components/cartitemsnew";


export default function Cart() {

    return(
        <div className="p-2 md:p-4 max-w-7xl mx-auto">
            <div className="mb-4">
                <Breadcrumbs />
            </div>
            <CartItemsnew />
        </div>
    )
}