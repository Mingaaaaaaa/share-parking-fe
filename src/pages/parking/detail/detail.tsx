import Taro from "@tarojs/taro";
import { get, post } from "../../../req";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Map,
  Picker,
  PageContainer,
} from "@tarojs/components";
import { ParkingSlot } from "@/type";

import "./detail.css";

export default function Detail() {
  const [parkingInfo, setParkingInfo] = useState<ParkingSlot>(null as any);
  const [latitude, setLatitude] = useState(32.11689);
  const [longitude, setLongitude] = useState(118.93019);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    dateRange: ["", ""],
    timeRange: ["", ""],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const { id, distance } = Taro.getCurrentInstance().router.params;
    get(`/parking_slots/${id}`).then((res) => {
      res.data.distance = distance;
      setParkingInfo(res.data);
      setLatitude(res.data.new_coordinates[1]);
      setLongitude(res.data.new_coordinates[0]);
      setForm({
        dateRange: res.data.dateRange,
        timeRange: res.data.timeRange,
      });
      calcTotalPrice(
        res.data.dateRange,
        res.data.timeRange,
        res.data.price_per_hour
      );
    });
  }, []);

  const handleReservation = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReservation = () => {
    if (!form.dateRange[0] || !form.dateRange[1]) {
      Taro.showToast({
        title: "请选择开始时间和结束时间",
        icon: "none",
        duration: 1000,
      });
      return;
    }
    post("/orders", {
      user_id: "333333333",
      slot_id: parkingInfo._id,
      start_time: form.dateRange[0] + "T" + form.timeRange[0],
      end_time: form.dateRange[1] + "T" + form.timeRange[1],
      total_price: totalPrice,
      name: parkingInfo.name,
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

  const handleRangeChange = (e, type, index) => {
    const value = e.detail.value;
    if (type === "date") {
      let newRange = form.dateRange;
      newRange[index] = value;
      setForm({
        ...form,
        dateRange: newRange,
      });
    } else {
      let newRange = form.timeRange;
      newRange[index] = value;
      setForm({
        ...form,
        timeRange: newRange,
      });
    }
    calcTotalPrice(form.dateRange, form.timeRange, parkingInfo.price_per_hour);
  };

  const calcTotalPrice = (dateRange, timeRange, price_per_hour) => {
    const start = new Date(`${dateRange[0]}T${timeRange[0]}:00`);
    const end = new Date(`${dateRange[1]}T${timeRange[1]}:00`);
    const hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    setTotalPrice(hours * price_per_hour);
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
            可用时间: {parkingInfo.timeRange[0]} - {parkingInfo.timeRange[1]}
          </Text>
          <View>
            <Text className="price">
              小时价格: {parkingInfo.price_per_hour}
            </Text>
            <Text className="distance">
              距离: {Number(parkingInfo.distance).toFixed(2)}KM
            </Text>
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

      <PageContainer
        round={true}
        position="bottom"
        show={isModalOpen}
        onLeave={() => setIsModalOpen(false)}
      >
        <View className="modal-content">
          <Text className="modal-title">预约订车场</Text>
          <Text className="label">开始时间</Text>
          <View className="start-range">
            <Picker
              value=""
              mode="date"
              className="picker-wrap"
              defaultValue={parkingInfo.dateRange[0]}
              onChange={(e) => handleRangeChange(e, "date", 0)}
            >
              <View className="picker">
                {parkingInfo.dateRange[0] || "请选择开始日期"}
              </View>
            </Picker>
            <Text>-</Text>
            <Picker
              value=""
              mode="time"
              className="picker-wrap"
              defaultValue={parkingInfo.timeRange[0]}
              onChange={(e) => handleRangeChange(e, "time", 0)}
            >
              <View className="picker">
                {parkingInfo.timeRange[0] || "请选择开始时间"}
              </View>
            </Picker>
          </View>
          <Text className="label">结束时间</Text>
          <View className="end-range">
            <Picker
              mode="date"
              value=""
              defaultValue={parkingInfo.dateRange[1]}
              className="picker-wrap"
              onChange={(e) => handleRangeChange(e, "date", 1)}
            >
              <View className="picker">
                {parkingInfo.dateRange[1] || "请选择结束日期"}
              </View>
            </Picker>
            <Text>-</Text>
            <Picker
              mode="time"
              className="picker-wrap"
              value={parkingInfo.timeRange[1]}
              onChange={(e) => handleRangeChange(e, "time", 1)}
            >
              <View className="picker">
                {parkingInfo.timeRange[1] || "请选择结束时间"}
              </View>
            </Picker>
          </View>
          <View className="btns">
            <Button
              className="cancel-button"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button
              className="confirm-button"
              onClick={handleConfirmReservation}
            >
              立即支付 ¥{totalPrice.toFixed(2)}
            </Button>
          </View>
        </View>
      </PageContainer>
    </View>
  );
}
