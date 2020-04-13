import ProductGrid from "./ProductGrid.js";

$(document).ready(function () {
  let options = {
    jsonUrl: "data/product.json",
    name: "name",
    url: "url",
    color: "color",
    brand: "brand",
    sold: "sold_out",
    mainContainer: "#display",
    filterContainer: "#filterhead",
    displayContainer: "#result",
    styleClassName: "card",
  }
  let shop = new ProductGrid(options);
  shop.init();
});
