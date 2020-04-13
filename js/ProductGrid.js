export default class ProductGrid {
  constructor(options) {
    this.data    = [];
    this.productList = [];
    this.uniqueColor = [];
    this.uniqueBrand = [];
    this.showAvailable = false;
    this.filteredColor = new Set();
    this.filteredBrand = new Set();
    this.jsonUrl = options.jsonUrl;
    this.$mainContainer    = $(options.mainContainer);
    this.$filterContainer  = this.$mainContainer.find($(options.filterContainer));
    this.$displayContainer = this.$mainContainer.find($(options.displayContainer));
    this.styleClassName    = options.styleClassName;
    this.filterByAttribute = options.filterByAttribute;
  }

  init() {
    $.ajax({
      url: this.jsonUrl,
      type: "get",
      dataType: "json",
      success: (data) => {
        this.data = data;
        this.createProducts();
        this.createFilter();
        this.filterItems();
      }
    });
  }
  createProducts()
  {
    console.log('this.data :', this.data);
    this.data.forEach(item => {
      let product = new Product(item);
      this.productList.push(product);
    })

    console.log('this.productList :', this.productList);
  }

  addFilters(brandArrays, colorArrays)
  {
    this.makeFilter(brandArrays, "brand");
    this.makeFilter(colorArrays, "color"); 
    this.makeToggle();
  }
  
  makeFilter(categoryArray, category)
  {
    categoryArray.forEach((categoryItem) => {
      let $itemInputElement = $("<input>", { type: "checkbox", id: categoryItem, class: category })
        .on("click", () => this.addFiltering() );
      let $itemLabelElement = $("<label>", { for: categoryItem, text: categoryItem});
      this.$filterContainer
        .append($("<br>"))
        .append($itemInputElement)
        .append($itemLabelElement)
    })
  }

  makeToggle()
  {
    let $itemInputElement = $("<input>", { type: "checkbox",id: "sold_out", class: "sold_out" })
      .on("click", () => this.addFiltering() );
    let $itemLabelElement = $("<label>", { for: "sold_out", text: "Show Available"});
    this.$filterContainer
      .append($("<br>"))
      .append($itemInputElement)
      .append($itemLabelElement)    
  }

  addFiltering()
  {
    let checkbox = $(event.target);
    let category = checkbox.attr("id");
    let categoryType = checkbox.attr("class"); 
    console.log('checkbox :', checkbox);
    if(categoryType == "sold_out")
    {
      checkbox.is(':checked') ? this.showAvailable = true : this.showAvailable = false;
    }
    else if(categoryType == "brand")
    {
      checkbox.is(':checked') ? this.filteredBrand.add(category) : this.filteredBrand.delete(category)
    }
    else if(categoryType == "color")
    {
      checkbox.is(':checked') ? this.filteredColor.add(category) : this.filteredColor.delete(category)
    }
    this.filterItems();
  }

  filterItems()
  {
    let itemToDisplay = this.productList;
    if(this.showAvailable)
    {
      itemToDisplay = this.productList.filter((item) => { 
        return (item.sold_out == 0)
      })
    }
    if(this.filteredColor.size > 0) {

      itemToDisplay = itemToDisplay.filter((item) => { return this.filteredColor.has(item.color)} )
    }
    if(this.filteredBrand.size > 0) {      
      itemToDisplay = itemToDisplay.filter((item) => { return this.filteredBrand.has(item.brand)} )
    }

    Display.show(itemToDisplay, this.$displayContainer, this.styleClassName);
  }

  createFilter()
  {
    this.productList.forEach((item) => {
      this.uniqueColor.push(item.color);
      this.uniqueBrand.push(item.brand); 
    });

    this.uniqueBrand = this.uniqueSort(this.uniqueBrand);
    this.uniqueColor = this.uniqueSort(this.uniqueColor);
    this.addFilters(this.uniqueBrand, this.uniqueColor);
  }

  uniqueSort(arrayList)
  {
    let setList = new Set();
    arrayList.forEach((item) => setList.add(item) );

    return arrayList = Array.from(setList)
      .sort( (a,b) => this.sortArrayFunction(a, b));
  }

  sortArrayFunction(a, b)
  {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
}

class Product
{
  constructor(item)
  {
    this.name     = item.name;
    this.url      = item.url;
    this.color    = item.color;
    this.brand    = item.brand;
    this.sold_out = item.sold_out;
  }
}

class Display
{
  static show(itemToDisplay, $displayContainer, styleClassName)
  {
    $displayContainer.children().detach();
    itemToDisplay.forEach( (item) => {
    let $element = 
    $("<p>").addClass(styleClassName)
    .append($("<img>", { src: "data/images/"+item.url, width: "150px", height: "150px"}) );
    
    $displayContainer.append($element);
    })
  }

}