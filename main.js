const glados = async () => {
  const cookie = process.env.GLADOS
  if (!cookie) return
  try {
    const headers = {
      'cookie': cookie,
      'referer': 'https://glados.rocks/console/checkin',
      'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    }
    const checkin = await fetch('https://glados.rocks/api/user/checkin', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{"token":"glados.one"}',
    }).then((r) => r.json())
    const status = await fetch('https://glados.rocks/api/user/status', {
      method: 'GET',
      headers,
    }).then((r) => r.json())
    return [
      'Checkin OK',
      `${checkin.message}`,
      `Left Days ${Number(status.data.leftDays)}`,
    ]
  } catch (error) {
    return [
      'Checkin Error',
      `${error}`,
      `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}>`,
    ]
  }
}

const notify = async (contents) => {
  const token = process.env.NOTIFY
  if (!token || !contents) return
  return await fetch(`https://luckycola.com.cn/tools/customMail`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "ColaKey": "ze5c0RW9El5Eyj1732690635311lQJaLgpfEez",// 官网获取
      "tomail": "guan810@aliyun.com",// 邮件发给谁?
      "fromTitle": "Glados checkin",// 邮件标题
      "subject": "我是邮件主题",
      // 邮件系统授权码，参考[获取文档]:https://blog.csdn.net/qq_48896417/article/details/133903185?spm=1001.2014.3001.5501
      "smtpCode": token,
      // 开启授权码对应的授权邮箱
      "smtpEmail": "18222796870@163.com",
      // 授权邮箱的类型， 可取值是 qq 或 163 或 126
      "smtpCodeType": "163",
      "isTextContent": true,// 邮件内容是否是纯文本形式
      "content": contents,// 邮件内容
    }),
  }).then((r) => r.json())
}

const main = async () => {
  const content = await glados()
  console.log(content)
  console.log(await notify(content))
}

main()
