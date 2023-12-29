class Count {
  #count = null;
  constructor(inModel, inConnector) {
    this.model = inModel;
    this.connector = inConnector;
  }

  async init() {
    // Try to initialize count if it isn't
    if (this.#count !== null) return true;
    try {
      let c = await this.fetchCount();
      return true;
    } catch (err) {
      console.log("i Erred");
      return false;
    }
  }
  async fetchCount() {
    // get count from the db
    this.#count = await this.model.countDocuments();
  }

  increment() {
    return ++this.#count;
  }
  get count() {
    return this.#count;
  }
  set count(inCount) {
    this.#count = inCount;
  }
}

exports.Count = Count;
