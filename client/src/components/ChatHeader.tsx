export default function ChatHeader() {
    return (
      <div
        className="bg-[#2b2b2b] h-[50px] flex items-center sticky top-0 justify-between w-full px-1"
        id="header-section"
      >
        <div className="flex items-center space-x-1 text-white">
          <img src="/avatar-default.svg" className="size-[20px] rounded-full" />
          <h2>Name: {}</h2>
        </div>
        <div className="text-white">Search bar</div>
      </div>
    );
  }
  