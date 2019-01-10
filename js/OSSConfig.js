const Base64 = require("@/utils/upload/Base64.js");
require("@/utils/upload/hmac.js");
require("@/utils/upload/sha1.js");
const Crypto = require("@/utils/upload/crypto.js");

//   随机文件名
export function randomString (len) {
    len = len || 32;
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// 获取oss policyBase64
export function getPolicyBase64() {
    let date = new Date();
    date.setHours(date.getHours() + 87600);
    let srcT = date.toISOString();
    const policyText = {
        expiration: srcT, //设置该Policy的失效时间
        conditions: [
            ["content-length-range", 0, 10 * 1024 * 1024] // 设置上传文件的大小限制,10mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}
// 获取oss签名
export function getSignature(policyBase64, accessKeySecret) {
    const accesskey = accessKeySecret;

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

/**
 * @desc 补零方法
 * @param [str, length, char]  -要补充的字符串  - 要补充达到的长度默认是2   - 被补充的字符 默认是 '0'
 **/
export function addZero (str = "", length = 2, char = "0") {
    return str.toString().padStart(length, char);
};