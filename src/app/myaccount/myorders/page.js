import MyOrderscomp from "@/components/myordercomp";
import Link from "next/link";


export default function Myorders() {

    return(
        <>
        <Link href="/myaccount">Back to Orders</Link>
        <MyOrderscomp />
        </>
    )
}