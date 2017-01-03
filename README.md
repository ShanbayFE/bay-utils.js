# utils.js

> A Common Functions Library for Javascript

This project is **working in progress**.

# Basic Usage

The easiest way to use utils is to load the built script:

```html
<script type="text/javascript" src="utils.js"></script>
```

You can also use the baydn(Shanbay CDN):
```html
<script type="text/javascript" src="utils.js"></script> // TODO
```

Having include the dependencies, the library can be used:

```js
xbayCommon.getFormData($formEl);
xbayCommon.formatDate(date);
...
```

## Format

#### parseDate
    /**
     * 获取一个日期对象
     * @param {string} time 日期
     * @return {Object} date 一个日期对象
     */
     const date = parseDate(time);

#### formatDate
    /**
     * 获取某一格式的日期
     * @param {string} date 日期
     * @return {string} dateStr 格式为 y-m-d 的日期
     */
     const dateStr = formatDate(date);

## Validator

#### assertString
验证输入是否是字符串
    > xbayCommon.assertString(111)
    > false

#### toString
    > xbayCommon.toString({x: 1})
    > false

#### merge
合并两个 object，第二个参数的 key 不会覆盖前面的。
    > xbayCommon.merge({x: 1}, {x: 2, y: 4})
    > false

#### isStandardBrowserEnv
判断是否是标准的浏览器环境
    > xbayCommon.isStandardBrowserEnv()
    > false

#### isFunction
    > xbayCommon.isFunction(function(){})
    > true

#### isWechatUA
判断 Agent 是否是微信
    > xbayCommon.isWechatUA(navigator.userAgent)
    > false

#### isMobileUA
判断 Agent 是否是手机
    > xbayCommon.isMobileUA(navigator.userAgent)
    > false

#### isShanbayAppUA
判断 Agent 是否是扇贝 APP
    > xbayCommon.isShanbayAppUA(navigator.userAgent)
    > false

#### isMobilePhone
判断字符串是否是手机号
    > xbayCommon.isMobilePhone(13323432221)
    > true

#### isEmail
判断字符串是否是邮箱
    > xbayCommon.isEmail('133@qq.com')
    > true

#### isUrl
判断字符串是否是 url
    > xbayCommon.isUrl('https://www.shanbay.com/')
    > true

#### escapeStr
转义 <, >, &, ', " 和 /。
    > xbayCommon.escapeStr('<p>hi</p>')
    > "&lt;p&gt;hi&lt;&#x2F;p&gt;"

#### unescapeStr
    > xbayCommon.unescapeStr("&lt;p&gt;hi&lt;&#x2F;p&gt;")
    > "<p>hi</p>"

#### isStrLength
第二个参数是 options，默认为 {min:0, max: undefined}
    > xbayCommon.isStrLength('hello', {min: 2, max: 5})
    > true

#### isJSON
判断字符串是不是 json，使用 json.parse
    > xbayCommon.isJSON('hello')
    > false
    > xbayCommon.isJSON(JSON.stringify({x: 1}))
    > true

#### isNumeric
判读字符串是否为数字
    > xbayCommon.isNumeric('123');
    > true

#### isEmptyStr
判断字符串是否为空
    > xbayCommon.isEmptyStr('123');
    > false

## Dom

#### getFormData
    /**
     * 获取表单数据
     * @param {element} formEl 表单元素
     * @return {Object} data 表单中 name 有值的输入框的数据，数据结构与 FormData 相同。
                        当输入框 type 为 radio 的时候，只返回选中状态的值。
     */
     const data = getFormData(formEl);

#### clearFormData
    /**
     * 清空表单输入框的值
     * @param {element} formEl 表单元素
     */
     clearFormData(formEl);

#### selectElement
    /**
     * 选择元素中的内容
     * @param {element} el 元素
     */
     selectElement(el);

#### copyToClipboard
    /**
     * 复制文字到剪贴板
     * @param {string} text 复制的内容
     */
     copyToClipboard(text);

#### lazyloadImage
    /**
     * 图片懒加载
     */
     lazyloadImage();


## Others

#### ajax
    /**
    * @param {string} options 类似 jquery ajax 的 options。
    * 不同的是当 isOriginal 为 false 时，success 判断了 status_code 为 0，success 会返回 data，
    * 而 error 是在请求失败时调用的(包括 status_code 不为 0)，会返回 status 和 msg 两个参数。
    * @param {string} isOriginal 为 true 时，将不会对 success 和 error 做任何处理，默认为 false
    * @param {object} configure 当 key 为 LOGIN_URL 时，值是请求 401 或 403 时 redirect 的 url，默认为 '/accounts/login'。
    */
    ajax(options, isOriginal, configure);

#### getSearchValue
    /**
    * 获取链接中 search 的值
    * @param {string} name 名称
    * @param {string} url 链接，默认为当前链接
    */
    const value = getSearchValue(name);

#### getCookie
    /**
    * 获取 cookie 中的值
    * @param {string} cookie 名称
    * @param {string} name 名称
    */
    const value = getCookie(cookie, name);
