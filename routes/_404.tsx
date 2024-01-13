import { ErrorPage } from "../components/ErrorPage.tsx";

export default function Error404() {
  const title = "Page not found";
  const description = "Sorry, we couldn't find the page you're looking for.";
  const code = "404";
  return ErrorPage(title, description, code);
}
