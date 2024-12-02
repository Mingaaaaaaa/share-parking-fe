import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { get } from "../../req";
import "./index.css";
import { Order } from "@/type";

export default function Index() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    get("/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <View className="orders">
      {orders.map((order) => (
        <View key={order._id} className="order-card">
          <View className="order-info">
            <Text className="order-slot">车位号: {order.name}</Text>
            <Text className="order-id">订单号: {order._id}</Text>
            <Text className="order-time">时间: {order.availableTime}</Text>
            <Text className="order-status">
              状态: {order.status ? "已完成" : "进行中"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
