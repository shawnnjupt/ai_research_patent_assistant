# -*- coding: utf-8 -*-

import asyncio
import re

import websockets
import uuid
import json
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.lke.v20231130 import lke_client, models
import ssl
import certifi

ssl_context = ssl.create_default_context()
ssl_context.load_verify_locations(certifi.where())

scheme = "https"  # 协议
req_method = "POST"  # 请求方法
region = "ap-guangzhou"  # 地域
conn_type_api = 5  # API 访客


def get_session():
    # uuid
    return str(uuid.uuid1())


def get_request_id():
    return str(uuid.uuid1())


def api_token():
    try:
        # 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
        # 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
        # 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
        cred = credential.Credential(secret_id, secret_key)
        # 实例化一个http选项，可选的，没有特殊需求可以跳过
        httpProfile = HttpProfile()
        httpProfile.endpoint = "lke.tencentcloudapi.com"

        # 实例化一个client选项，可选的，没有特殊需求可以跳过
        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile
        # 实例化要请求产品的client对象,clientProfile是可选的
        client = lke_client.LkeClient(cred, region, clientProfile)

        # 实例化一个请求对象,每个接口都会对应一个request对象
        req = models.GetWsTokenRequest()
        params = {
            "Type": conn_type_api,
            "BotAppKey": bot_app_key,
            "VisitorBizId": visitor_biz_id
        }
        req.from_json_string(json.dumps(params))
        # 返回的resp是一个GetWsTokenResponse的实例，与请求对象对应
        resp = client.GetWsToken(req)
        # 输出json格式的字符串回包
        print(resp.to_json_string())
        return resp.Token
    except TencentCloudSDKException as err:
        print(err)


pattern = r'\d+(.*)'


async def call_ws(token, message):
    url = f"wss://wss.lke.cloud.tencent.com/v1/qbot/chat/conn/?EIO=4&transport=websocket"
    full_response = ""  # 用于存储完整响应内容
    async with websockets.connect(url, ssl = ssl_context) as ws:
        response = await ws.recv()
        print("连接建立：" + response)

        auth = {"token": token}
        auth_message = f"40{json.dumps(auth)}"
        await ws.send(auth_message)

        # 收到服务端鉴权后的包
        response = await ws.recv()
        print("鉴权结果：" + str(response))

        session_id = get_session()
        request_id = get_request_id()
        payload = {
            "payload": {
                "request_id": request_id,
                "session_id": session_id,
                "content": f"{message}",
            }
        }
        req_data = ["send", payload]

        send_data = f"42{json.dumps(req_data, ensure_ascii=False)}"
        print("发送数据：" + send_data)
        await ws.send(send_data)
        while True:
            rsp = await ws.recv()
            if rsp == '2':
                # 收到了心跳包
                await ws.send("3")
                continue
            # 正则匹配 获取结果对象
            rsp_re_result = re.search(pattern, rsp).group(1)
            rsp_dict = json.loads(rsp_re_result)
            if rsp_dict[0] == "error":
                print(rsp_dict)
                break
            elif rsp_dict[0] == "reply":
                if rsp_dict[1]["payload"]["is_from_self"]:
                    # print(f"from self:{rsp_dict[1]['payload']['content']}")
                    continue
                elif rsp_dict[1]["payload"]["is_final"]:
                    content = rsp_dict[1]["payload"]["content"]
                    full_response += content
                    # print(f"数据接收完成::{rsp_dict[1]['payload']['content']}\n\n\n\n\n")
                    break
                else:
                    # print(rsp_dict)
                    continue
            
    return full_response        


def main():
    message = "你是谁"
    print(f"请求内容: {message}")
    token = api_token()
    print(token)
    if token == "":
        print("get token error")
        exit(0)
    result=asyncio.run(call_ws(token, message))
    print(result)


if __name__ == "__main__":
    main()