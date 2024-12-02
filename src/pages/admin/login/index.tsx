import Taro from "@tarojs/taro";
import { useState } from "react";
import { post } from "../../../req";
import { Image } from "@tarojs/components";
import backgroundImage from "../../../assets/bg.jpg";
import { View, Text, Input, Button } from "@tarojs/components";
import "./index.css";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    post("/users/login", { username, password }).then((res) => {
      if (res.data) {
        Taro.setStorageSync("role", res.data);
        Taro.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1000,
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: "/pages/admin/index",
          });
        }, 1000);
      } else {
        Taro.showToast({
          title: "登录失败",
          icon: "none",
          duration: 2000,
        });
      }
    });
  };

  return (
    <View className="login">
      <Image src={backgroundImage} className="background" />

      <View className="title">超级管理员登录</View>
      <View className="form-item">
        <Text className="label">用户名</Text>
        <Input
          className="input"
          value={username}
          onInput={(e) => setUsername(e.detail.value)}
        />
      </View>
      <View className="form-item">
        <Text className="label">密码</Text>
        <Input
          className="input"
          type="password"
          value={password}
          onInput={(e) => setPassword(e.detail.value)}
        />
      </View>
      <Button className="login-button" onClick={handleLogin}>
        登录
      </Button>
    </View>
  );
}
