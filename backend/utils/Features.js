class Features {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }


  // Search functionality
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "1",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }


  //   filter functionality
  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing some fields for Category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }


  // pagination functionality
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = Features;
