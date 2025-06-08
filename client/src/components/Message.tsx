interface MessageProps {
    content: string;
    from: string;
    id: string;
  }
  
export default function Message({ content, from, id }: MessageProps) {
return (
    <div>
        <div>{from}</div>
        <div className="flex items-center space-x-2" id={id}>
            <img src="/avatar-default.svg" className="size-4"/>
            <div>{content}</div>
        </div>
    </div>
);
}
