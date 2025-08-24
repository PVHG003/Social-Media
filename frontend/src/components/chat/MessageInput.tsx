import { Plus, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const MessageInput = () => {
  return (
    <div className="flex items-center p-4 gap-4">
      <div>
        <Input id="file-upload" type="file" className="hidden" />
        <label htmlFor="file-upload">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Plus className="h-5 w-5" />
          </Button>
        </label>
      </div>

      <Input placeholder="Type your message here ..." />

      <Button variant={"outline"} size="icon" className="rounded-full">
        <Send />
      </Button>
    </div>
  );
};

export default MessageInput;
