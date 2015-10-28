;(function () {
  RongIMClient.init("vnroth0kr90lo");

  var RongIMInstance = RongIMClient.getInstance();

  var token = '61iWMVJAQEPcO3bb7DfEErq948KGgPFDCDPLLUb3/uuM5DpGQjXVWuMJuLUlGqpMCqYIz5CyVGYYPfUOcbtrWQ==';
  RongIMClient.connect(token,{
    onSuccess: function (userId) {
      console.log(userId);
    }
  });

  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        //链接成功
        case RongIMClient.ConnectionStatus.CONNECTED:
          console.log('链接成功');
          break;
        //正在链接
        case RongIMClient.ConnectionStatus.CONNECTING:
          console.log('正在链接');
          break;
        //重新链接
        case RongIMClient.ConnectionStatus.RECONNECT:
          console.log('重新链接');
          break;
        //其他设备登陆
        case RongIMClient.ConnectionStatus.OTHER_DEVICE_LOGIN:
        //连接关闭
        case RongIMClient.ConnectionStatus.CLOSURE:
        //未知错误
        case RongIMClient.ConnectionStatus.UNKNOWN_ERROR:
        //登出
        case RongIMClient.ConnectionStatus.LOGOUT:
        //用户已被封禁
        case RongIMClient.ConnectionStatus.BLOCK:
          break;
      }
    }
  });

  RongIMClient.getInstance().setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      switch(message.getMessageType()){
        case RongIMClient.MessageType.TextMessage:
          // do something...
          break;
        case RongIMClient.MessageType.ImageMessage:
          // do something...
          break;
        case RongIMClient.MessageType.VoiceMessage:
          // do something...
          break;
        case RongIMClient.MessageType.RichContentMessage:
          // do something...
          break;
        case RongIMClient.MessageType.LocationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.DiscussionNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.InformationNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.ContactNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.ProfileNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.CommandNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.UnknownMessage:
          // do something...
          break;
        default:
          // 自定义消息
          // do something...
      }
    }
  });

  function send(message) {
    RongIMClient.getInstance().sendMessage(RongIMClient.ConversationType.PRIVATE, "targetId", RongIMClient.TextMessage.obtain("发送消息内容"), null, {
      onSuccess: function () {

        
      },
      onError: function (x) {
          var info = '';
          switch (x) {
              case RongIMClient.callback.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
              case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
              case RongIMClient.SendErrorStatus.REJECTED_BY_BLACKLIST:
                  info = '在黑名单中，无法向对方发送消息';
                  break;
              case RongIMClient.SendErrorStatus.NOT_IN_DISCUSSION:
                  info = '不在讨论组中';
                  break;
              case RongIMClient.SendErrorStatus.NOT_IN_GROUP:
                  info = '不在群组中';
                  break;
              case RongIMClient.SendErrorStatus.NOT_IN_CHATROOM:
                  info = '不在聊天室中';
                  break;
              default :
                  info = x;
                  break;
          }
          console.alert('发送失败:' + info);
      }
    });
  }

  function history() {
    RongIMClient.getInstance().getHistoryMessages(RongIMClient.ConversationType.PRIVATE,'targeid',20,{
       onSuccess:function(symbol,HistoryMessages){
        console.log(HistoryMessages)
          // symbol为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
          // HistoryMessages 为拉取到的历史消息列表，列表中消息为对应消息类型的消息实体
      },onError:function(e){
        console.log(e)
          // APP未开启消息漫游或处理异常
          // throw new ERROR ......
      }
  });
  }

  this.RongIMSend = send;
  this.RongIMHistory = history;
}.call(this));