import { getProductsOnSSR, getUniqueCategories } from "./mocks/handlers.js";
import { HomePage, NotFoundPage, ProductDetailPage } from "./pages";
import { router } from "./router/router.js";

router.addRoute("/", () => {
  const {
    products,
    pagination: { total: totalCount },
  } = getProductsOnSSR(router.query);
  const categories = getUniqueCategories();
  const results = { products, totalCount, categories };

  return {
    initialData: results,
    html: HomePage(results),
    head: "<title>쇼핑몰</title>",
  };
});

router.addRoute("/products/:id", () => {
  return {
    initialData: { products: [] },
    html: ProductDetailPage(),
    head: "<title>쇼핑몰 상세 페이지</title>",
  };
});

router.addRoute(".*", () => {
  return {
    initialData: {},
    html: NotFoundPage(),
    head: "<title>쇼핑몰 404 페이지</title>",
  };
});

// 초기 데이터를 위한 곳
export const render = async (url, query) => {
  console.log({ url, query });
  return "";
};
