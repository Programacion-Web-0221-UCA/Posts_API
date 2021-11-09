
class ServiceResponse {
  constructor(status = true, content = undefined) {
    this.status = status;
    this.content = content;
  }
}

module.exports = ServiceResponse;