import Breadcrumbs from "@/components/Breadcrumbs";
import MyOrderscomp from "@/components/myordercomp";
import Link from "next/link";


export default function Myorders() {

    return(
        <>
          <div className="max-w-7xl mx-auto px-3 pt-4">
           <Breadcrumbs />
            </div>
        <Link href="/myaccount">Back to Orders</Link>
        <MyOrderscomp />
        </>
    )
}