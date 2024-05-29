export default async function apiCaller({
  request,
  errorHandler = defaultErrorHandler,
}) {
  let response;
  try {
    // store.dispatch(loadingHandler(true));
    response = await request();
    return response?.data || response;
  } catch (error) {
    // if (error.ec === 419 || error.ec === 420) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   localStorage.removeItem("role");
    //   store.dispatch(removeUser());
    //   store.dispatch(updateLoginState(false));
    //   store.dispatch(tokenHandler(true));
    // }
    console.log("🚀 ~ response:", response)
    errorHandler(error);
    return response;
  } finally {
    // store.dispatch(loadingHandler(false));
  }
}

function defaultErrorHandler(error) {
  console.error("An error occurred:", error);
}
