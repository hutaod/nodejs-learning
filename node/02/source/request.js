module.exports = {
  get url() {
    // console.log(this)
    return this.req.url
  },
  get method() {
    return this.req.method.toLowerCase()
  }
}
