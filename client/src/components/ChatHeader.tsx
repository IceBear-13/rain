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
        <div className="text-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white border-b border-white pb-1 outline-none focus:border-b-2 transition-all w-[300px]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-0 top-1/2 transform -translate-y-1/2 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  