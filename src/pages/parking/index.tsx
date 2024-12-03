import { get } from "../../req";
import Taro from "@tarojs/taro";
import Down from "./../../assets/down.png";
import { useState, useEffect, useRef } from "react";
import searchIcon from "./../../assets/nav_serch_icon.png";
import { View, Text, Input, Button, Picker, Image } from "@tarojs/components";

import "./index.css";
import { ParkingSlot } from "@/type";

export default function Index() {
  const [searchName, setSearchName] = useState("");
  const userLocation = useRef({ latitude: 0, longitude: 0 });
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [communities, setCommunities] = useState<ParkingSlot[]>([]);
  const [parkingList, setParkingList] = useState<ParkingSlot[]>([]);

  useEffect(() => {
    let firstTimeId = 0;
    // 获取所有小区列表
    get("/neighborhoods").then((res) => {
      const communityList = res.data.map((community) => ({
        id: community._id,
        name: community.name,
      }));
      setCommunities(communityList);

      // 默认拉取第一个小区的所有车位
      if (communityList.length > 0) {
        setSelectedCommunity(communityList[0].name);
        firstTimeId = communityList[0].id;
      }
    });

    // 获取用户位置
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userLocation"]) {
          Taro.authorize({
            scope: "scope.userLocation",
            success: () => {
              getUserLocation(firstTimeId);
            },
            fail: () => {
              Taro.openSetting({
                success: (res) => {
                  console.log(res.authSetting);
                  if (res.authSetting["scope.userLocation"]) {
                    getUserLocation(firstTimeId);
                  }
                },
              });
            },
          });
        } else {
          getUserLocation(firstTimeId);
        }
      },
    });
  }, []);

  const getUserLocation = (id) => {
    Taro.getLocation({
      type: "wgs84",
      highAccuracyExpireTime: 4000,
      isHighAccuracy: true,
      success: (res) => {
        userLocation.current = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        fetchParkingSlots(id);
      },
    });
  };

  const fetchParkingSlots = (communityId) => {
    get(`/parking_slots/getSlots/${communityId}`).then((res) => {
      const parkingData = res.data.map((parking) => {
        const distance = calculateDistance(
          userLocation.current.latitude,
          userLocation.current.longitude,
          parking.new_coordinates[1],
          parking.new_coordinates[0]
        );
        return { ...parking, distance };
      });
      parkingData.sort((a, b) => a.distance - b.distance);
      setParkingList(parkingData);
    });
  };

  const handleCommunityChange = (e) => {
    const selectedIndex = e.detail.value;
    const selectedCommunity = communities[selectedIndex];
    setSelectedCommunity(selectedCommunity.name);
    fetchParkingSlots(selectedCommunity.id);
  };

  const handleInput = (e) => {
    setSearchName(e.detail.value);
    // 手机键盘回车搜索
    if (e.detail.keyCode === 13 && searchName) {
      let tar = parkingList.filter((parking) =>
        parking.name.includes(searchName)
      );
      setParkingList(tar);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // 地球半径，单位为公里
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 返回距离，单位为公里
  };

  const detail = (id, distance) => {
    Taro.navigateTo({
      url: `/pages/parking/detail/detail?id=${id}&distance=${distance}`,
    });
  };

  return (
    <View className="parking">
      <View className="header">
        <Picker
          mode="selector"
          className="select-wrap"
          range={communities.map((community) => community.name)}
          onChange={handleCommunityChange}
        >
          <View className="select">
            <Text className="neighName">
              {selectedCommunity || "点击选择小区"}
            </Text>
            <Image src={Down} className="down-icon" />
          </View>
        </Picker>
        <View className="input-wrap">
          <Image src={searchIcon} className="search-icon" />
          <Input
            className="input"
            placeholder="搜索车位名称"
            value={searchName}
            onInput={handleInput}
          />
        </View>
      </View>
      <View className="list">
        {parkingList.map((parking: ParkingSlot) => (
          <View key={parking.id} className="list-item">
            <View className="info">
              <Text className="name">车位号: {parking.name}</Text>
              <Text className="available-time">
                可用时间: {parking.start_time} - {parking.end_time}
              </Text>
              <Text className="address">地址: {parking.address}</Text>
              <View className="sub-info">
                <Text className="price">
                  小时价格:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {parking.price_per_hour}
                  </Text>
                  元
                </Text>
                <Text className="distance">
                  距离:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {parking.distance ? parking.distance.toFixed(2) : "未知"}
                  </Text>
                  千米
                </Text>
                <Text
                  className="available"
                  style={{
                    backgroundColor:
                      parking.slot_status === "active" ? "#bdf3bd" : "#f3b3b3",
                  }}
                >
                  {parking.slot_status === "active" ? "可预约" : "审核中"}
                </Text>
              </View>
            </View>
            <View className="detail-btn-wrap">
              <Button
                className="detail-button"
                disabled={parking.slot_status !== "active"}
                onClick={() => {
                  detail(parking._id, parking.distance);
                }}
              >
                详情
              </Button>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
