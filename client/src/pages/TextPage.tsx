export default function TextPage() {
  return (
    <>
      <div className="flex h-screen w-screen">
        {/* Sidebar - 20% width */}
        <div className="h-full bg-red-400 w-[20%]">sidebar section</div>
        
        {/* Main content area - 80% width */}
        <div className="relative h-full w-[80%]" id="main-section">
          {/* Header bar */}
          <div className="bg-black h-[50px] flex items-center sticky top-0 justify-between w-full px-1" id="header-section">
            <div className="flex items-center space-x-1 text-white">
              <img src="/avatar-default.svg" className="size-[20px] rounded-full"/>
              <h2>Name</h2>
            </div>
            <div className="text-white">Search bar</div>
          </div>
          
          {/* Content would go here */}
          <div className="h-[calc(100%-90px)]"></div>
          
          {/* Footer bar */}
          <div className="bg-pink-400 w-full h-[45px] items-center flex sticky bottom-0">Text section</div>
        </div>
      </div>
    </>
  )
}
