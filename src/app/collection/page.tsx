import { Suspense } from "react";
import Main from "@/features/collection/components/Main";

export default function collection() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-simpson-white dark:bg-simpson-dark">
          <span className="text-sm text-gray-500">Chargement de la collection...</span>
        </div>
      }>
        <Main />
      </Suspense>
    </div>
  );
}