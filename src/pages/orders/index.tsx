import { Order } from "@/type";
import Taro from "@tarojs/taro";
import { get, post } from "../../req";
import { useState, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";

import "./index.css";

const statusMap: { [key: number]: string } = {
  0: "待使用",
  1: "使用中",
  2: "已完成",
  3: "已取消",
};
export default function Index() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    get("/orders").then((res) => {
      res.data.sort((a, b) => a.status - b.status);
      setOrders(res.data);
    });
  }, []);

  function handleCancel(id) {
    post(`/orders/cancel/${id}`).then((res) => {
      console.log(res);
      Taro.reLaunch({
        url: "/pages/orders/index",
      });
    });
  }

  return (
    <View className="orders">
      {orders.map((order) => (
        <View
          key={order._id}
          className="order-card"
          style={{ backgroundColor: order.status === 3 ? "#bfbebe" : "#fff" }}
        >
          <View className="order-info">
            <Text className="order-slot">车位号: {order.name}</Text>
            <Text className="order-id">订单号: {order._id}</Text>
            <Text className="order-time">
              时间: {order.start_time} - {order.end_time}
            </Text>
            <View className="order-bottom">
              <Text className="order-status">
                状态: {statusMap[order.status]}
              </Text>
              <Button
                className="cancel-btn"
                onClick={() => handleCancel(order._id)}
                style={{ display: order.status !== 3 ? "block" : "none" }}
              >
                <Text>取消订单</Text>
              </Button>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
