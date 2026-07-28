import { Suspense } from "react";
import SellResultView from "../_components/SellResultView";

export default function SellFailurePage() {
  return (
    <Suspense>
      <SellResultView status="fail" />
    </Suspense>
  );
}
