import Taro from "@tarojs/taro";
import { get } from "../../req";
import { ParkingSlot } from "@/type";
import { useState, useEffect } from "react";
import rentBackground from "../../assets/rentcar.png";
import { View, Image, Button } from "@tarojs/components";

import "./index.css";

export default function Index() {
  const [rentHistory, setRentHistory] = useState<ParkingSlot[]>([]);

  useEffect(() => {
    get("/parking_slots?type=all").then((res) => {
      setRentHistory(res.data);
    });
  }, []);

  const handlePublish = () => {
    Taro.navigateTo({
      url: "/pages/rent/publish/index",
    });
  };

  return (
    <View className="rent">
      <Image src={rentBackground} className="background" />
      <View className="history">
        <View className="rent-record">租车记录</View>
        {rentHistory.map((record) => (
          <View key={record._id} className="history-item">
            <View className="name">车位名称: {record.name}</View>
            <View className="time">时间: {record.availableTime}</View>
            <View className="price">价格: {record.price_per_hour}元/小时</View>
            <View className="status">
              状态: {record.slot_status === "active" ? "出租中" : "不可用"}
            </View>
            <View className="address">地址: {record.address}</View>
          </View>
        ))}
      </View>
      <Button className="publish-button" onClick={handlePublish}>
        发布车位
      </Button>
    </View>
  );
}
