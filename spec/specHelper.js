var specHelper = (function() {
  // HELPERS

  function setupFakeXHR() {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];
    this.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
    this.expectRequest = expectRequest;
    this.respondJSON = respondJSON;
    this.respondXML = respondXML;
  }

  function expectRequest(url, content) {
    expect(this.requests.length).toBe(1);
    expect(this.requests[0].url).toBe(url);
    expect(this.requests[0].requestBody).toBe(content);
  }

  function respondXML(content) {
    var request = this.requests.pop();
    header = { "Content-Type": "application/xml;charset=utf-8" };
    body = '<?xml version="1.0" encoding="UTF-8"?>\n';
    body += content;
    request.respond(200, header, body);
  }

  function respondJSON(object) {
    var request = this.requests.pop();
    header = { "Content-Type": "application/json;charset=utf-8" };
    body = JSON.stringify(object);
    request.respond(200, header, body);
  }

  return {
    setupFakeXHR:  setupFakeXHR,
  }

})();