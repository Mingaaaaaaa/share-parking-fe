import Taro from "@tarojs/taro";
import { get } from "../../req";
import { useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";

import "./index.css";
import { ParkingSlot } from "@/type";

export default function Index() {
  const [parkingList, setParkingList] = useState<ParkingSlot[]>([]);

  useEffect(() => {
    // check user role by localstorage and redirect to login page if not admin
    const role = Taro.getStorageSync("role");
    if (role !== "admin") {
      Taro.redirectTo({
        url: "/pages/admin/login/index",
      });
    } else {
      // 获取所有未审核的车位列表
      get("/parking_slots").then((res) => {
        const inactivate = res.data.filter(
          (item) => item.slot_status === "inactive"
        );
        const activate = res.data.filter(
          (item) => item.slot_status === "active"
        );
        setParkingList([...inactivate, ...activate]);
      });
    }
  }, []);

  const handleViewDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/admin/audit/audit?id=${id}`,
    });
  };

  return (
    <View className="admin-review">
      <View className="list">
        {parkingList.map((parking) => (
          <View
            key={parking._id}
            className={`list-item ${
              parking.slot_status === "active" ? "inactive" : ""
            }`}
          >
            <View className="info">
              <Text className="name">车位名称: {parking.name}</Text>
              <Text className="address">地址: {parking.address}</Text>
              <Text className="price">
                价格: {parking.price_per_hour}元/小时
              </Text>
              <Text className="status" style={{ fontWeight: "bolder" }}>
                状态: {parking.slot_status === "inactive" ? "未审核" : "已审核"}
              </Text>
            </View>
            <Button
              className={`detail-button ${
                parking.slot_status === "active" ? "inactive" : ""
              }`}
              onClick={() => handleViewDetail(parking._id)}
            >
              查看详情
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}
