## 和鸣插件已安装

确认 `hermes plugins enable heming` 成功后，运行 `hermes gateway setup` 并选择“和鸣 · 扫码连接”。

选择和鸣后，当前终端直接显示二维码。使用支持智能体功能的和鸣扫码、输入机器人名称，完成后启动或重启当前 profile 的 Gateway。已有身份会复用，不需要重新创建机器人。模型与工具沿用 Hermes 配置，无需填写和鸣平台密钥。

需要 Node.js 24+。配套后端和支持智能体的客户端须已部署；当前正式 APK 的扫码支持状态请先确认。详见本插件 README.md 的兼容发布状态。
