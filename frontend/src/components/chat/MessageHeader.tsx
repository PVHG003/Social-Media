import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MessageHeader = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage></AvatarImage>
        <AvatarFallback>PM</AvatarFallback>
      </Avatar>

      <h2>Username</h2>
    </div>
  );
};

export default MessageHeader;
