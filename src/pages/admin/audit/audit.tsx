import Taro from "@tarojs/taro";
import { get, post } from "../../../req";
import { useState, useEffect } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import overView from "../../../assets/over-view.png";
import "./audit.css";
import { ParkingSlot } from "@/type";

export default function Audit() {
  const [parkingInfo, setParkingInfo] = useState<ParkingSlot>(null as any);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router.params;
    get(`/parking_slots/${id}`).then((res) => {
      setParkingInfo(res.data);
    });
  }, []);

  const handleAudit = (action: "approve" | "reject") => {
    const { id } = Taro.getCurrentInstance().router.params;
    post(`/parking_slots/${action}/${id}`).then(() => {
      Taro.showToast({
        title: action === "approve" ? "审核通过" : "审核拒绝",
        icon: action === "approve" ? "success" : "none",
        duration: 1000,
      });
      setTimeout(() => {
        Taro.reLaunch({
          url: "/pages/admin/index",
        });
      }, 1000);
    });
  };

  if (!parkingInfo) {
    return <View>加载中...</View>;
  }

  return (
    <View className="admin-review-detail">
      <View className="info">
        <Text className="name">车位名称: {parkingInfo.name}</Text>
        <Text className="address">地址: {parkingInfo.address}</Text>
        <Text className="price">价格: {parkingInfo.price_per_hour}元/小时</Text>
        <Text className="available-time">
          可用时间: {parkingInfo.start_time} - {parkingInfo.end_time}
        </Text>
        <Image src={overView} className="guide-map" />
        <Text className="desc">导览图</Text>
        <Image src={parkingInfo.proof_image} className="proof-image" />
        <Text className="desc">车位证明图</Text>
      </View>
      <View className="buttons">
        <Button className="reject-button" onClick={() => handleAudit("reject")}>
          审核拒绝
        </Button>
        <Button
          className="approve-button"
          onClick={() => handleAudit("approve")}
        >
          审核通过
        </Button>
      </View>
    </View>
  );
}
