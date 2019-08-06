io.use(passportSocketIo.authorize({
    cookieParser,
    key: process.env.SECRET_SESSION,
    secret: process.env.KEY_SESSION,
    store: storeSession,
    success: (data, accept) => {
      if(!data.user.logged_in){
        return accept("Invalid user .",false);
      }
      return accept(null,true);
    },
    fail: (data, message, error, accept)=>{
      if (error)
        throw new Error(message);
      console.log('failed connection to socket.io:', message);
      accept(null, false);
      if (error) accept(new Error(message));
    }
  }));