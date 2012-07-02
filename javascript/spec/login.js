describe("Login", function() {

  beforeEach(function() {
    this.srp = new SRP();
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];
    this.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function() {
    this.xhr.restore();
  });

  it("has an identify function", function() {
    expect(typeof this.srp.identify).toBe('function');
  });

  it("logs in successfully (INTEGRATION)", function(){
    var callback = sinon.spy();
    var a = 'af141ae6';
    var B = '887005895b1f5528b4e4dfdce914f73e763b96d3c901d2f41d8b8cd26255a75';
    var salt = '5d3055e0acd3ddcfc15';
    var M = 'be6d7db2186d5f6a2c55788479b6eaf75229a7ca0d9e7dc1f886f1970a0e8065'
    var M2 = '2547cf26318519090f506ab73a68995a2626b1c948e6f603ef9e1b0b78bf0f7b';
    srp = new SRP()
    srp.success = callback;
    var A = srp.calculateAndSetA(a);
    srp.identify();

    expect(this.requests.length).toBe(1);
    expect(this.requests[0].url).toBe("handshake/");
    expect(this.requests[0].requestBody).toBe("I=user&A=" + A);
    specHelper.respondXML(this.requests[0], "<r s='"+salt+"' B='"+B+"' />");
    expect(this.requests.length).toBe(2);
    expect(this.requests[1].url).toBe("authenticate/");
    expect(this.requests[1].requestBody).toBe("M=" + M);
    specHelper.respondXML(this.requests[1], "<M>"+M2+"</M>");

    expect(callback).toHaveBeenCalled();
    expect(window.location.hash).toBe("#logged_in")
  });


});
