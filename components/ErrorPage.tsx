import { Head } from "$fresh/runtime.ts";
import { GoBackHomeButton } from "./GoBackHomeButton.tsx";

export function ErrorPage(
  title: string,
  description: string,
  errorCode: string,
) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">{errorCode}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {description}
          </p>
          <div className="mt-10 flex items-center justify-center">
            <GoBackHomeButton />
          </div>
        </div>
      </main>
    </>
  );
}
