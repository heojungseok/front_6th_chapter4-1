import { getProductsOnSSR, getUniqueCategories } from "./mocks/handlers.js";
import { router } from "./router/router.js";

// 초기 데이터를 위한 곳
export const render = async (url, query) => {
  try {
    router.setUrl(url, "http://localhost");
    router.query = query;
    router.start();
    const routeInfo = router.findRoute(url);

    // SSR용 초기 데이터 생성
    let req = {};
    if (routeInfo.path === "/") {
      const {
        products,
        pagination: { total: totalCount },
      } = getProductsOnSSR(query);
      const categories = getUniqueCategories();

      req = {
        products,
        totalCount,
        categories,
        loading: false,
        error: null,
      };
    }

    // req 매개변수를 포함하여 호출
    const result = await routeInfo.handler(routeInfo.params, query, req);
    console.log("✅ SSR 완료");

    return result;
  } catch (error) {
    console.error("❌ SSR 에러:", error);
    return {
      head: "<title>에러</title>",
      html: "<div>서버 오류가 발생했습니다.</div>",
      initialData: { error: error.message },
    };
  }
};
