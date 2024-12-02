import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import rentIcon from "../../assets/rent.jpg";
import adminIcon from "../../assets/admin.png";
import orderIcon from "../../assets/orders.jpg";
import parkingIcon from "../../assets/parking.jpg";
import backgroundImage from "../../assets/bg.jpg";

import "./index.css";

export default function Index() {
  const handleButtonClick = (path: string) => {
    Taro.navigateTo({ url: path });
  };
  if (!Taro.getStorageSync("role")) {
    Taro.setStorageSync("role", "user");
  }

  return (
    <View className="body">
      <Image src={backgroundImage} className="background" />
      <View className="home">
        <View
          className="module"
          onClick={() => handleButtonClick("/pages/parking/index")}
        >
          <Image src={parkingIcon} className="icon" />
          <Text>找车位</Text>
        </View>
        <View
          className="module"
          onClick={() => handleButtonClick("/pages/rent/index")}
        >
          <Image src={rentIcon} className="icon" />
          <Text>租车位</Text>
        </View>
        <View
          className="module"
          onClick={() => handleButtonClick("/pages/orders/index")}
        >
          <Image src={orderIcon} className="icon" />
          <Text>我的订单</Text>
        </View>
        <View
          className="module"
          onClick={() => handleButtonClick("/pages/admin/index")}
        >
          <Image src={adminIcon} className="icon" />
          <Text>审核出租</Text>
        </View>
      </View>
    </View>
  );
}
