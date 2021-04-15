# axios从入门到源码分析

## 1. 前后台交互的基本过程
    1. 前后应用从浏览器端向服务器发送HTTP请求(请求报文)
    2. 后台服务器接收到请求后, 调度服务器应用处理请求, 向浏览器端返回HTTP响应(响应报文)
    3. 浏览器端接收到响应, 解析显示响应体/调用监视回调

## 2. HTTP请求报文
    1. 请求行: 请求方式/url
    2. 多个请求头: 一个请求头由name:value组成, 如Host/Cookie/Content-Type头
    3. 请求体

## 3. HTTP响应报文
    1. 响应行: 响应状态码/对应的文本
    2. 多个响应头: 如 Content-Type / Set-Cookie 头
    3. 响应体

## 4. post请求体文本参数格式
    1. Content-Type: application/x-www-form-urlencoded;charset=utf-8
        用于键值对参数，参数的键值用=连接, 参数之间用&连接
        例如: name=%E5%B0%8F%E6%98%8E&age=12
    2. Content-Type: application/json;charset=utf-8
        用于json字符串参数
        例如: {"name": "%E5%B0%8F%E6%98%8E", "age": 12}

## 5. url上的2种请求参数
    query参数: 
        路由path: /xxx
        请求path: /xxx?username=xxx&password=yyy   
        获取参数: req.query.username / req.query.password
    params参数: 
        路由path: /xxx/:username/:password
        请求path: /xxx/xxx/123   
        获取参数: req.params.username / req.params.password

## 5. 常见响应状态码
    200	OK                     请求成功。一般用于GET与POST请求
    201 Created                已创建。成功请求并创建了新的资源
    401 Unauthorized           未授权/请求要求用户的身份认证
    404 Not Found              服务器无法根据客户端的请求找到资源
    500 Internal Server Error  服务器内部错误，无法完成请求

## 6. 不同类型的请求及其作用:
    1. GET: 从服务器端读取数据
    2. POST: 向服务器端添加新数据
    3. PUT: 更新服务器端已经数据
    4. DELETE: 删除服务器端数据

## 7. API的分类
    1. REST API:    restful
        发送请求进行CRUD哪个操作由请求方式来决定
        同一个请求路径可以进行多个操作
        请求方式会用到GET/POST/PUT/DELETE
    2. 非REST API:   restless
        请求方式不决定请求的CRUD操作
        一个请求路径只对应一个操作
        一般只有GET/POST
    测试: 可以使用json-server快速搭建模拟的rest api 接口

## 8. 理解XHR
    使用XMLHttpRequest (XHR)对象可以与服务器交互, 也就是发送ajax请求
    前端可以获取到数据，而无需让整个的页面刷新。
    这使得Web页面可以只更新页面的局部，而不影响用户的操作。

## 9. 区别ajax请求与一般HTTP请求
    ajax请求是一种特别的http请求: 只有通过XHR/fetch发送的是ajax请求, 其它都是一般HTTP请求
    对服务器端来说, 没有任何区别, 区别在浏览器端
    浏览器端发请求: 只有XHR或fetch发出的才是ajax请求, 其它所有的都是非ajax请求
    浏览器端接收到响应
        一般请求: 浏览器一般会直接显示响应体数据, 也就是我们常说的刷新/跳转页面
        ajax请求: 浏览器不会对界面进行任何更新操作, 只是调用监视的回调函数并传入响应相关数据

## 10. 使用XHR封装一个发ajax请求的通用函数
    函数的返回值为promise, 成功的结果为response, 异常的结果为error
    能处理多种类型的请求: GET/POST/PUT/DELETE
    函数的参数为一个配置对象: url/method/params/data
    响应json数据自动解析为了js
    
    1. 返回一个promise对象
    2. 函数参数是一个配置对象
    3. 创建建xhr对象发ajax请求
    4. 携带请求参数
    5. 读取响应数据, 更新promise



## 11. axios的特点
1. 基于promise的封装XHR的异步ajax请求库
2. 浏览器端/node端都可以使用
3. 支持请求／响应拦截器:
    - <span style="color:red">后边设置的请求拦截器先执行</span>
    - <span style="color:red">发送请求</span>
    - <span style="color:red">收到了请求，但是还没传给axios的then中的回调函数</span>
    - <span style="color:red">先设置的响应拦截器先执行</span>
    - <span style="color:red">axios的then内回调函数执行</span>
4. 支持请求取消
    - <span style="color:red">如果在返回响应前取消了请求，那么也就会直接去把axios的状态置为rejected</span>
5. 请求/响应数据转换
6. 批量发送多个请求

## 12. axios常用语法
    axios(config): 通用/最本质的发任意类型请求的方式
    axios(url[, config]): 可以只指定url发get请求
    axios.request(config): 等同于axios(config)
    axios.get(url[, config]): 发get请求
    axios.delete(url[, config]): 发delete请求
    axios.post(url[, data, config]): 发post请求
    axios.put(url[, data, config]): 发put请求
    
    axios.defaults.xxx: 请求的默认全局配置
    axios.interceptors.request.use(): 添加请求拦截器
    axios.interceptors.response.use(): 添加响应拦截器
    
    axios.create([config]): 创建一个新的axios(它没有下面的功能)
    
    axios.Cancel(): 用于创建取消请求的错误对象
    axios.CancelToken(): 用于创建取消请求的token对象
    axios.isCancel(): 是否是一个取消请求的错误
    axios.all(promises): 用于批量执行多个异步请求
    axios.spread(): 用来指定接收所有成功数据的回调函数的方法

### axios的then函数中的回调执行时机：

axios会返回一个promise对象，但是这个promise对象的状态什么时候确定呢？只要这个状态一确定，then中的回调就能执行了。

1. <span style="color:red">如果成功返回了响应，这时就是resolve(response)</span>
2. <span style="color:red">如果没能拿回响应，那么就置为rejected</span>
3. <span style="color:red">如果在返回响应前取消了请求，那么也就会直接去置为rejected</span>

### 请求/响应拦截器

```js
axios.defaults.baseURL = 'http://localhost:3000'

/* 
添加请求拦截器
1. 是什么? 
  是在发请求前执行的回调函数
2. 作用
    对请求的配置做一些处理: data, header, 界面loading提示
    对请求进行检查, 如果不满足条件不发请求
*/
//第二个请求拦截器比第一个请求拦截器先执行！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
axios.interceptors.request.use(function (config) {
  console.log('req interceptor1 onResolved()', config)
  return config;
});
axios.interceptors.request.use(function (config) {
  console.log('req interceptor2 onResolved()', config)
  // return config; // 必须返回config
  return config
});

/* 
  添加响应拦截器
  1. 是什么? 
    在得到响应后执行的回调函数，但是在axios的then回调前执行
2. 作用
    对请求成功的数据进行处理
    对请求失败进行处理
*/
axios.interceptors.response.use(
  function (response) {
    console.log('res interceptor1 onResolved()', response)
    // throw "error!!!!!!!!!!!"
    // return response;
    return response.data;//由下边的一个interceptor.response.use来接收。也就是下一个响应拦截器接收！！！！！！！！！！！！！！！！！！！
  },
  function (error) {
    console.log('res interceptor1 onRejected()')
    // return Promise.reject(error);
    throw error;
  }
)
axios.interceptors.response.use(
  function (data) {
    console.log('res interceptor2 onResolved()', data)
    return data;//最后一个响应拦截器返回的数据由axios().then的回调函数接收。！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  },
  function (error) {
    console.log('res interceptor2 onRejected()')
    // return Promise.reject(error);
    throw error;
  }
)

//响应回调的执行顺序是：第一个响应拦截器、第二个响应拦截器。。。axios的then回调。！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
axios({
  url: '/posts'
}).then(
  data => {
    console.log('onResolved()', data)
  },
  error => {
    console.log('onRejected()')
  }
)
```

### 取消请求

```js
 let cancel = []
    //每一个axios请求对应一个cancel Token。
    function getProducts1() {
      axios('/getProducts1', {
        cancelToken: new axios.CancelToken((c) => { // 在传入配置参数时，cancelToken属性就被立即赋值，！！！！！！！！！！！！！！！！！！！！！！！！！！
                                                    // 那么CancelToken中执行器也立即同步执行, 并传入用于取消请求的函数！！！！！！！！！！！！！！！！！！！！
          // 保存用于取消请求的函数
          cancel.push(c)
        })
      })
      .then(
        response => {
          // cancel = null
          console.log('1111 onResolved', response.data)
        },
        error => {
          if (axios.isCancel(error)) { // 判断是否是取消请求导致的错误！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
            console.log('1111 取消请求', error.message)
          } else {
            console.log('1111 请求出错', error.message)
          }
          
        }
      )
    }

    function getProducts2() {
      axios({
        url: '/getProducts2',
        cancelToken: new axios.CancelToken((c) => { // 在CancelToken中立即同步执行, 并传入用于取消请求的函数
          // 保存用于取消请求的函数
          cancel.push(c)
        })
      }).then(
        response => console.log('2222 onResolved', response.data),
        error => {
          if (axios.isCancel(error)) {
            console.log('2222 取消请求', error.message)
          } else {
            console.log('2222 请求出错', error.message)
          }
        }
      )
    }

    function cancelReq() {
      // 取消请求 ,取消请求后axios的then将进入失败的回调。！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      if (JSON.stringify(cancel)!=="[]") {
        cancel.forEach(cl => {
          cl("强制取消")
        });
        cancel = [];
        // cancel('强制取消')
      }
    }
```

```js
axios.defaults.baseURL = 'http://localhost:4000'
let cancel
function getProducts1() {

  // 如果有未完成的请求, 取消这个请求
  if (cancel) {
    cancel('强制取消')
  }

  axios('/getProducts1', {
    cancelToken: new axios.CancelToken((c) => { // 在CancelToken中立即同步执行, 并传入用于取消请求的函数
      // 保存用于取消请求的函数
      cancel = c
    })
  })
  .then(
    response => {
      cancel = null
      console.log('1111 onResolved', response.data)
    },
    error => {
      // cancel = null; //不能把cancel=null写在这里。当发出第二个请求的时候，把第一个请求置为了rejected。！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                        //而且cancel这时已经是第二个请求的cancelToken，然后到了处理第一个请求的then的onRejected回调，！！！！！！！！！！！！！！！！！！！！！！
                        //如果上来就让cancel=null，那么第二个请求的cancelToken就丢失了，后边就没办法取消第二个请求了！！！！！！！！！！！！！！！！！！！！！！！！
      if (axios.isCancel(error)) { // 取消请求导致的错误
        console.log('1111 取消请求', error.message)
      } else {
        cancel = null
        console.log('1111 请求出错', error.message)
      }
      
    }
  )
}

function getProducts2() {

  // 如果有未完成的请求, 取消这个请求
  if (cancel) {
    cancel('强制取消')
  }

  axios({
    url: '/getProducts2',
    cancelToken: new axios.CancelToken((c) => { // 在CancelToken中立即同步执行, 并传入用于取消请求的函数
      // 保存用于取消请求的函数
      cancel = c
    })
  }).then(
    response => {
      cancel = null
      console.log('2222 onResolved', response.data)
    },
    error => {
      if (axios.isCancel(error)) {
        console.log('2222 取消请求', error.message)
      } else {
        cancel = null
        console.log('2222 请求出错', error.message)
      }
    }
  )
}

function cancelReq() {
  // 取消请求
  if (cancel) {
    cancel('强制取消')
  }
}
```



## 13. 源码难点与流程分析

    1. axios与Axios的关系
        axios函数对应的是Axios.prototype.request方法通过bind(Axiox的实例)产生的函数
        axios有Axios原型上的所有发特定类型请求的方法: get()/post()/put()/delete()
        axios有Axios的实例上的所有属性: defaults/interceptors
        后面又添加了create()/CancelToken()/all()
    2. axios.create()返回的对象与axios的区别
        1). 相同: 
            都是一个能发任意请求的函数: request(config)
            都有发特定请求的各种方法: get()/post()/put()/delete()
            都有默认配置和拦截器的属性: defaults/interceptors
        2). 不同:
            默认匹配的值不一样
            instance没有axios后面添加的一引起方法: create()/CancelToken()/all()
    3. axios发请求的流程
        1). 整体流程: request(config)  ===> dispatchRequest(config) ===> xhrAdapter(config)
        2). request(config): 将请求拦截器 / dispatchRequest() / 响应拦截器 通过promise链串连起来, 返回promise
        3). dispatchRequest(config): 转换请求数据 ===> 调用xhrAdapter()发请求 ===> 请求返回后转换响应数据. 返回promise
        4). xhrAdapter(config): 创建XHR对象, 根据config进行相应设置, 发送特定请求, 并接收响应数据, 返回promise 
    4. axios的请求/响应拦截器是什么?
        1). 请求拦截器: 在真正发请求前, 可以对请求进行检查或配置进行特定处理的函数, 
                   包括成功/失败的函数, 传递的必须是config
        2). 响应拦截器: 在请求返回后, 可以对响应数据进行特定处理的函数,
                   包括成功/失败的函数, 传递的默认是response
    5. axios的请求/响应数据转换器是什么?
        1). 请求转换器: 对请求头和请求体数据进行特定处理的函数
            setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
            return JSON.stringify(data)
        2). 响应转换器: 将响应体json字符串解析为js对象或数组的函数
            response.data = JSON.parse(response.data)
    6. response的整体结构
        {
            data,
            status,
            statusText,
            headers,
            config,
            request
        }
    7. error的整体结构
        {
            message,
            request,
            response
        }
    8. 如何取消未完成的请求
        1).当配置了cancelToken对象时, 保存cancel函数
            创建一个用于将来中断请求的cancelPromise
            并定义了一个用于取消请求的cancel函数
            将cancel函数传递出来
        2.调用cancel()取消请求
            执行cacel函数, 传入错误信息message
            内部会让cancelPromise变为成功, 且成功的值为一个Cancel对象
            在cancelPromise的成功回调中中断请求, 并让发请求的proimse失败, 失败的reason为Cacel对象
