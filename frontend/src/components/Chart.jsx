import backgroundImage from "../assets/Images/creeper-in-whatsapp-default-backdrop-v0-bow5gv7xh6ba1.jpg";
import TypeInput from "./TypeInput";
import Messages from "./Messages";

const Chart = () => {
  const styles = {
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      alignItems: "center",
      color: "white", // Text color
    },
  };

  return (
    <div style={styles.background} className="h-screen">
      
      <div className="overflow-y-auto hide-scrollbar">
        <Messages />
      </div>

      <TypeInput />
    </div>
  );
};

export default Chart;
