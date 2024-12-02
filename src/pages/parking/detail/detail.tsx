import Taro from "@tarojs/taro";
import { get, post } from "../../../req";
import { useState, useEffect } from "react";
import { View, Text, Button, Map } from "@tarojs/components";

import "./detail.css";
import { ParkingSlot } from "@/type";

export default function Detail() {
  const [parkingInfo, setParkingInfo] = useState<ParkingSlot>(null as any);
  const [latitude, setLatitude] = useState(32.11689);
  const [longitude, setLongitude] = useState(118.93019);

  useEffect(() => {
    const { id, distance } = Taro.getCurrentInstance().router.params;
    get(`/parking_slots/${id}`).then((res) => {
      res.data.distance = distance;
      setParkingInfo(res.data);
      setLatitude(res.data.new_coordinates[1]);
      setLongitude(res.data.new_coordinates[0]);
    });
  }, []);

  const handleReservation = () => {
    // 处理预约逻辑
    post("/orders", {
      user_id: "333333333",
      slot_id: parkingInfo._id,
      ...parkingInfo,
    }).then(() => {
      Taro.showToast({
        title: "预约成功",
        icon: "success",
        duration: 1000,
      });
      setTimeout(() => {
        Taro.navigateTo({
          url: `/pages/orders/index`,
        });
      }, 1000);
    });
  };

  const handleNavigation = () => {
    Taro.openLocation({
      latitude,
      longitude,
      name: parkingInfo.name,
      address: parkingInfo.address,
    });
  };

  if (!parkingInfo) {
    return <View>加载中...</View>;
  }

  return (
    <View className="detail">
      <Map
        className="map"
        latitude={latitude}
        longitude={longitude}
        markers={[
          {
            id: 1,
            latitude: latitude,
            longitude: longitude,
            width: 30,
            height: 30,
            title: parkingInfo.name,
            iconPath: "https://img.icons8.com/color/48/000000/marker.png",
          },
        ]}
        scale={16}
        onError={(e) => console.log("map error", e)}
        onInitComplete={(e) => console.log("map init", e)}
      />
      <View className="card-warp">
        <View className="info">
          <Text className="name">车位号: {parkingInfo.name}</Text>
          <Text className="available-time">
            可用时间: {parkingInfo.availableTime}
          </Text>
          <View>
            <Text className="price">
              小时价格: {parkingInfo.price_per_hour}
            </Text>
            <Text className="distance"> 距离: {parkingInfo.distance}</Text>
          </View>
          <Text className="address">地址: {parkingInfo.address}</Text>
        </View>
        <View className="navi-wrap">
          <Button className="navi" onClick={handleNavigation}></Button>
          <Text className="distance">到这里去</Text>
        </View>
      </View>
      <Button className="reservation-button" onClick={handleReservation}>
        马上预约
      </Button>
    </View>
  );
}
