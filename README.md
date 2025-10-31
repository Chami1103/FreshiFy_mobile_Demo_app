<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

# 🍎 FreshiFy Demo Template

**FreshiFy** is a modular demo project for real-time food freshness and spoilage detection using **AI (Image Classification)** and **IoT (Gas Sensor)**.  
This template provides a ready-to-use environment combining **Flask APIs**, **TensorFlow models**, and **ESP32 sensor integration**, with data persistence handled by **MongoDB** or **SQLite**.

---

## 📘 Overview

FreshiFy demonstrates how artificial intelligence and IoT can be integrated to detect food spoilage both visually and through gas sensors.  
It includes:

- 🧠 **Image Freshness Detection** (TensorFlow)
- 🌡️ **Gas Sensor Detection** (ESP32 + MQ-137)
- ⚙️ **Flask-based Backends** for each service
- 🗃️ **MongoDB or SQLite** persistence
- 💻 **Tkinter Desktop GUI**
- 🧩 **APIs for mobile/IoT integration**

This template is perfect for **researchers**, **students**, and **developers** who want to build or extend smart food monitoring systems.

---

## 📦 Repository Components

| Component | File | Description |
|------------|------|-------------|
| 🧠 **Image Detection Backend** | `image_freshify.py` | Flask API for classifying food images as *Fresh* or *Spoiled* using a trained MobileNetV2 model (`Fruit_Classifier.h5`). |
| 🌡️ **Sensor Detection Backend** | `sensor_freshify.py` | Flask API for processing NH₃ and RGB readings from ESP32 sensors to estimate spoilage status. |
| 🗃️ **Database Layer** | `DB_FreshiFy.py` | MongoDB abstraction for storing sensor readings, image results, notifications, and logs. |
| 💻 **GUI Demo** | `main_App.py` | Simple Tkinter-based local desktop demo for fruit classification with CSV logging. |
| ⚙️ **ESP32 Firmware** | `Arduino_Code.ino` | Firmware for ESP32 + MQ-137 + TCS230 to post live sensor data to the Flask API. |

---

## 🗂 Folder Structure

