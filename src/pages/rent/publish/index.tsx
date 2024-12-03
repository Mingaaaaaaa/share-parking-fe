import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Input,
  Picker,
  Button,
  Map,
  Image,
} from "@tarojs/components";
import { get, post } from "../../../req";
import "./index.css";
import { Neighborhood, ParkingSlot } from "@/type";

export default function Publish() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [form, setForm] = useState<ParkingSlot>({
    neighborhood_id: "",
    name: "",
    address: "",
    price_per_hour: 0,
    new_coordinates: [0, 0],
    proof_image: "",
    dateRange: ["", ""],
    timeRange: ["", ""],
    distance: 0,
  });

  useEffect(() => {
    get("/neighborhoods").then((res) => {
      setNeighborhoods(res.data);
    });
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userLocation"]) {
          Taro.authorize({
            scope: "scope.userLocation",
            success: () => {
              console.log("授权成功");
            },
            fail: () => {
              Taro.openSetting({
                success: (res) => {
                  console.log(res.authSetting);
                },
              });
            },
          });
        }
      },
    });

    Taro.getLocation({
      type: "wgs84",
      highAccuracyExpireTime: 4000,
      isHighAccuracy: true,
      success: (res) => {
        setForm({
          ...form,
          new_coordinates: [res.longitude, res.latitude],
        });
      },
    });
  }, []);

  const handleInputChange = (e, field) => {
    setForm({ ...form, [field]: e.detail.value });
  };

  const handleNeighborhoodChange = (e) => {
    const selectedIndex = e.detail.value;
    const selectedNeighborhood = neighborhoods[selectedIndex];
    setForm({ ...form, neighborhood_id: selectedNeighborhood._id });
  };

  const handleRangeChange = (e, type, field) => {
    const time = e.detail.value;
    if (type === "date") {
      let newRange = form.dateRange;
      newRange[field] = time;
      setForm({ ...form, dateRange: newRange });
    }
    if (type === "time") {
      let newRange = form.timeRange;
      newRange[field] = time;
      setForm({ ...form, timeRange: newRange });
    }
  };

  const handleMapClick = (e) => {
    const { latitude, longitude } = e.detail;
    console.log("latitude", latitude, "longitude", longitude);
    setForm({ ...form, new_coordinates: [longitude, latitude] });
  };

  const handleImageUpload = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        setForm({ ...form, proof_image: tempFilePath });
      },
    });
  };

  const handleSubmit = () => {
    const start_time = new Date(
      form.dateRange[0] + " " + form.timeRange[0].slice(0, 5)
    );
    const end_time = new Date(
      form.dateRange[1] + " " + form.timeRange[1].slice(0, 5)
    );
    const newForm = { ...form, start_time, end_time };
    post("/parking_slots", newForm).then((res) => {
      Taro.showToast({
        title: "发布成功",
        icon: "success",
        duration: 2000,
      });
      setTimeout(() => {
        Taro.navigateTo({
          url: "/pages/index/index",
        });
      }, 2000);
    });
  };

  return (
    <View className="publish">
      <View className="form-item">
        <Text className="label">小区</Text>
        <Picker
          mode="selector"
          range={neighborhoods.map((neighborhood) => neighborhood.name)}
          onChange={handleNeighborhoodChange}
        >
          <View className="picker">
            {form?.neighborhood_id
              ? neighborhoods.find(
                  (neighborhood) => neighborhood._id === form.neighborhood_id
                )?.name ?? "请选择小区"
              : "请选择小区"}
          </View>
        </Picker>
      </View>
      <View className="form-item">
        <Text className="label">车位号</Text>
        <Input
          className="input"
          value={form.name}
          onInput={(e) => handleInputChange(e, "name")}
        />
      </View>
      <View className="form-item">
        <Text className="label">地址</Text>
        <Input
          className="input"
          value={form.address}
          onInput={(e) => handleInputChange(e, "address")}
        />
      </View>
      <View className="form-item">
        <Text className="label">价格（元/小时）</Text>
        <Input
          className="input"
          type="number"
          value={form.price_per_hour.toString()}
          onInput={(e) => handleInputChange(e, "price_per_hour")}
        />
      </View>
      <View className="form-item">
        <Text className="label">开始时间</Text>
        <View className="start-range">
          <Picker
            value=""
            mode="date"
            className="picker-wrap"
            onChange={(e) => handleRangeChange(e, "date", 0)}
          >
            <View className="picker">
              {form.dateRange[0] || "请选择开始日期"}
            </View>
          </Picker>
          <Text>-</Text>
          <Picker
            mode="time"
            className="picker-wrap"
            onChange={(e) => handleRangeChange(e, "time", 0)}
          >
            <View className="picker">
              {form.timeRange[0] || "请选择开始时间"}
            </View>
          </Picker>
        </View>
        <Text className="label">结束时间</Text>
        <View className="end-range">
          <Picker
            mode="date"
            value=""
            className="picker-wrap"
            onChange={(e) => handleRangeChange(e, "date", 1)}
          >
            <View className="picker">
              {form.dateRange[1] || "请选择结束日期"}
            </View>
          </Picker>
          <Text>-</Text>
          <Picker
            mode="time"
            className="picker-wrap"
            onChange={(e) => handleRangeChange(e, "time", 1)}
          >
            <View className="picker">
              {form.timeRange[1] || "请选择结束时间"}
            </View>
          </Picker>
        </View>
      </View>

      <View className="form-item">
        <Text className="label">选择车位位置</Text>
        <Map
          className="map"
          longitude={118.93112512234393}
          latitude={32.11517754111049}
          onClick={handleMapClick}
          scale={16}
          markers={[
            {
              id: 1,
              longitude: form.new_coordinates[0],
              latitude: form.new_coordinates[1],
              width: 20,
              height: 20,
              iconPath: "https://img.icons8.com/color/48/000000/marker.png",
            },
          ]}
          onError={(e) => console.log("map error", e)}
        />
      </View>
      <View className="form-item">
        <Text className="label">上传车位拥有证明</Text>
        <Button className="upload-button" onClick={handleImageUpload}>
          上传图片
        </Button>
        {form.proof_image && (
          <Image src={form.proof_image} className="proof-image" />
        )}
      </View>
      <Button className="submit-button" onClick={handleSubmit}>
        提交
      </Button>
    </View>
  );
}
