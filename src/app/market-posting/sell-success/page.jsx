import { Suspense } from "react";
import SellResultView from "../_components/SellResultView";

export default function SellSuccessPage() {
  return (
    <Suspense>
      <SellResultView status="success" />
    </Suspense>
  );
}
