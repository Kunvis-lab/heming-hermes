# 和鸣 · Hermes 渠道插件

通过二维码将自己的 Hermes 智能体连接到和鸣。模型和工具沿用 Hermes 原有设置；和鸣只负责个人专属会话，不要求填写平台 Token、Webhook 或流式输出选项。

本仓库只分发 Hermes 插件，不包含和鸣客户端、服务器后端或任何用户数据。完整产品源码不在此公开。

## 安装

需要已有可用的 Hermes、Git，以及 PATH 中的 Node.js 24 或更新版本。Hermes 平台插件接口以官方 v0.22.2 验证；不承诺兼容任意旧版本。

```bash
hermes plugins install Kunvis-lab/heming-hermes --no-enable && hermes plugins enable heming
```

Hermes 可能要求确认第三方插件安全检查，请阅读提示后决定是否继续。不要跳过安全检查。安装包已包含连接器依赖，不需要运行 npm install。

随后执行：

```bash
hermes gateway setup
```

选择“和鸣 · 扫码连接”后，直接在当前终端显示二维码并等待扫码。完成配对后回到菜单，和鸣才显示为 `configured`；这代表配对信息已保存，不代表 Gateway 当前在线。已有 Gateway 服务时运行 `hermes gateway restart`；没有运行 Gateway 时可执行 `hermes gateway run` 前台启动。不要在同一 profile 中同时启动两个 Gateway。插件与 Gateway 必须使用相同的系统账号及 Hermes profile（自定义 HERMES_HOME 时同样如此）。

## 扫码连接

1. 在 `hermes gateway setup` 中选择和鸣，当前终端立即显示有效期 10 分钟的二维码。已完成配对时复用原身份，不重新创建机器人。
2. 使用支持智能体功能的和鸣客户端，进入“消息 → ＋ → 扫一扫”，自动识别智能体二维码。
3. 输入机器人名字，点击“创建并添加”，加入通讯录并自动进入专属会话。连接信息和解除连接在机器人联系人详情的“更多”中，不在个人页单设菜单。
4. 发送文字或 Markdown；回复更新同一条消息。重启后复用已有身份，无需重复扫码。

机器人直接反馈，不自动引用你的上一条消息。已配对的个人会话会自动成为和鸣默认会话，不要求输入 `/sethome`；已有的显式默认会话或禁用设置不会被覆盖。工具过程提示不拼进最终反馈，真实失败仍会明确显示。

**兼容发布状态：** 插件包发布不代表当前正式 APK 已具备智能体入口。首次发布时，配套后端与 Android 真机扫码尚未完成正式发布验收；请先确认所用客户端及服务器支持智能体配对与逐步回复，不能把“插件安装成功”当成完整接入成功。

第一版仅支持文字与 Markdown；不支持通过机器人收发附件、语音或视频通话。默认仅扫码授权的本人可使用，不开放其他人通过 ID 添加或加入群聊。

## 更新

```bash
hermes plugins update heming
```

更新后重启 Gateway。身份和会话状态保存在当前 Hermes profile 的 `heming/` 目录中，不在插件安装目录中；不要删除该目录、卸载 Hermes profile 或把身份文件上传到 GitHub。升级前建议自行安全备份整个 Hermes profile。

### 从旧安装来源迁移

新安装统一使用本页的 `Kunvis-lab/heming-hermes`。旧安装的 `update` 仍跟随原来的 Git 来源，不会自动切换。先停止当前 Gateway 并安全备份当前 profile，再依次运行：

```bash
hermes plugins remove heming
hermes plugins install Kunvis-lab/heming-hermes --no-enable
hermes plugins enable heming
```

这只更换插件目录；不要删除当前 profile 的 `heming/identity.json`，否则会丢失配对。完成后启动 Gateway，复用原机器人身份。请正常阅读安装安全提示，不使用跳过检查的选项。

## 安全与隐私

- 机器人是独立的端到端加密终端，身份私钥在运行 Hermes 的机器生成并保存。二维码不包含长期凭证或私钥。
- 插件只访问绑定的个人会话，不读取其他和鸣聊天。解除连接后，旧凭证停止使用。
- 主动发给机器人的内容会在 Hermes 主机解密，并可能交给 Hermes 配置的模型和工具；适用所选模型服务的数据处理规则。
- 插件运行在 Hermes 的权限范围内。仅在自己信任的机器和 Hermes 环境安装，不要将主机执行权限开放给陌生人。
- 保持 TLS 证书校验开启。无需修改防火墙入站规则，无需公开本机端口，也不要设置 NODE_TLS_REJECT_UNAUTHORIZED=0。

## 排查

- 找不到 node：安装 Node.js 24+，确认 Gateway 的运行账号能够执行 `node --version`；终端与系统服务的 PATH 可能不同。
- 看不到和鸣渠道：执行 `hermes plugins list` 检查 heming 是否已启用，确认使用正确的 profile，然后重新执行 gateway setup。
- 二维码没出现：检查 Node、网络，以及服务器是否已上线智能体配对接口；配对票据会过期，过期后重新选择和鸣扫码。若提示另一个配对进程正在运行，先在原窗口完成或取消它，不删除身份或正在使用的锁文件。旧版插件只会在 Gateway 输出中展示二维码，需更新插件以使用配置菜单扫码。
- 已连但没有回复：检查 Hermes 原有模型是否可用、Gateway 日志及和鸣兼容版本。不需要把模型密钥提供给和鸣。

可以用 `sha256sum -c SHA256SUMS` 检查下载文件的一致性（macOS 使用 `shasum -a 256 -c SHA256SUMS`）。校验文件本身不是数字签名，应同时确认仓库来源和可信版本。

## 授权与第三方许可

见 [NOTICE.md](NOTICE.md)。连接器内打包依赖的许可原文保留在 [LICENSES](LICENSES/)；本仓库公开分发不代表和鸣完整产品开源，也不代表获得 Hermes 官方认证。

官方参考：[Hermes 插件](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins)、[消息渠道](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)。
