import { AlignJustify, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const NoChatSelected = () => {
  const { user, isDrawerOpen, setIsDrawerOpen } = useAuth();
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 mt-50 relative">
      {!isDrawerOpen && (
        <AlignJustify
          className="w-8 h-8 sm:w-8 sm:h-8 text-primary  absolute bottom-115 left-5 cursor-pointer lg:hidden"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        />
      )}
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">
          Welcome {user?.user?.userName.split(" ")[0]}
        </h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
