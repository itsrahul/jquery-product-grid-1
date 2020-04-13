export default class ProductGrid {
  constructor(options) {
    this.data    = [];
    this.uniqueColor = [];
    this.uniqueBrand = [];
    this.showAvailable = false;
    this.filteredColor = new Set();
    this.filteredBrand = new Set();
    this.jsonUrl = options.jsonUrl;
    this.pName   = options.name;
    this.pUrl    = options.url;
    this.pColor  = options.color;
    this.pBrand  = options.brand;
    this.pSold   = options.sold;
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
        this.createFilter();
        this.filterItems();
      }
    });
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
    let itemToDisplay = this.data;
    if(this.showAvailable)
    {
      itemToDisplay = this.data.filter((item) => { 
        return (item[this.pSold] == 0)
      })
    }
    if(this.filteredColor.size > 0) {

      itemToDisplay = itemToDisplay.filter((item) => { return this.filteredColor.has(item[this.pColor])} )
    }
    if(this.filteredBrand.size > 0) {      
      itemToDisplay = itemToDisplay.filter((item) => { return this.filteredBrand.has(item[this.pBrand])} )
    }

    this.displayItems(itemToDisplay);
  }

  displayItems(itemToDisplay)
  {
    this.$displayContainer.children().detach();
    itemToDisplay.forEach( (item) => {
    let $element = 
    $("<p>").addClass(this.styleClassName)
    .append($("<img>", { src: "data/images/"+item[this.pUrl], width: "150px", height: "150px"}) );
    
    this.$displayContainer.append($element);
    })
  }

  createFilter()
  {
    this.data.forEach((item) => {
      this.uniqueColor.push(item[this.pColor]);
      this.uniqueBrand.push(item[this.pBrand]); 
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