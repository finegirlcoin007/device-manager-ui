export default (error) => {
    if(error.message === '自动取消ajax操作') return Promise.reject(error);
    if (!error.response) {
      console.error(error);
      return Promise.reject({
        message: '未知错误',
        error,
      });
    };
  
    let tip = '';
    const status = error.response.status;
  
    switch (status) {
      case 400:
          tip = '错误的请求参数';
          break;
      case 401:
          tip = '没有该操作权限';
          break;
      case 403:
          tip = '用户未登录或登录失效，请重新登录';
          break;
      case 404:
          tip = '错误的请求地址';
          break;
      case 405:
          tip = '请修改当前密码(原因:首次登录或超过期限未修改密码)';
          break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
          tip = '服务器错误';
          break;
      default:
          tip = '未知错误' + status;
    }
    if(status === 405){
      window.location='/#/login/updatePwd';
    }else{
      tip +='，将自动返回主页';
      window.location='/#/';
    }

    return Promise.reject({
      message: tip,
      error,
      status,
    });
  }
  