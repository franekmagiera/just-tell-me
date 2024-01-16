import { Button } from "../components/Button.tsx";
import { Header } from "../components/Header.tsx";
import { Input } from "../components/Input.tsx";
import { Label } from "../components/Label.tsx";

export default function Home() {
  return (
    <div>
      <Header />
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <form action="/summary/youtube">
          <Label htmlFor="youtube-video-id">
            Video ID or URL
          </Label>
          <Input
            id="youtube-video-id"
            type="text"
            name="id"
          />
          <div class="mt-3 flex items-center justify-center">
            <Button type="submit">
              Summarize
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
