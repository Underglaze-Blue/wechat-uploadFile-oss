## 微信小程序上传图片到 OSS

> 微信小程序上传文件到oss需要调用oss __JavaScript客户端签名直传__

> [JavaScript客户端签名直传](https://helpcdn.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.6.1123.42e2e1ebFPyqG2) [小程序上传示例](https://help.aliyun.com/document_detail/92883.html?spm=a2c4g.11186623.6.1136.530918c9BdI1dP)

#### 踩坑
1. oss文档定义的修改上传文件路径的文档是错误的，应该修改key值而不是Filename
2. STS 模式，使用直传模式需要添加 __x-oss-security-token__

#### 完整上传文件

```js
import {randomString, getPolicyBase64, getSignature, addZero} from '@/utils/upload/OSSConfig'

  // 选择图片
    chooseImg() {
      const policyBase64 = getPolicyBase64(); // OSS policyBase64
      const signature = getSignature(policyBase64, OSS.accessKeySecret); //获取签名 OSS.accessKeySecret是通过接口请求回来的
      const myDate = new Date();
      const datePath = myDate.getFullYear() + addZero(myDate.getMonth() + 1) + "/"; // 文件储存路径
      const companyCode = this.$local.fetch("userInfo").companyCode; // 文件储存路径
      // 微信选取图片
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          tempFilePaths.forEach((item, index) => {
            let fileName = new Date().getTime() + randomString(10);
            let fileStoragePath = companyCode + "/pic/" + datePath + fileName; // 文件存储路径
            wx.uploadFile({
              url: uploadURL, // oss地址
              filePath: item,
              name: "file",
              formData: {
                Filename: fileName,
                key: fileStoragePath,
                policy: policyBase64,
                OSSAccessKeyId: OSS.accessKeyId, // 请求回来的OSS数据
                signature: signature,
                success_action_status: "200",
                "x-oss-security-token": OSS.securityToken // 请求回来的OSS数据
              },
              success: function(res) {
                
              }
            });
          });
        }
      });
    }
```
> 其中 datePath，companyCode，fileStoragePath，randomString，addZero 为自定方法，生成文件储存路径和名称