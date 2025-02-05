// Define Router Object
var Router = {
  routes: [],
  mode: "hash",
  root: "/",
  config: function (options) {
    this.mode = options && options.mode ? options.mode : this.mode;
    this.root =
      options && options.root
        ? "/" + this.clearSlashes(options.root) + "/"
        : "/";
    return this;
  },
  getFragment: function () {
    var fragment = "";
    if (this.mode === "history") {
      fragment = this.clearSlashes(
        decodeURI(location.pathname + location.search)
      );
      fragment = fragment.replace(/\\?(.*)$/, "");
      fragment = this.root !== "/" ? fragment.replace(this.root, "") : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : "";
    }
    return this.clearSlashes(fragment);
  },
  clearSlashes: function (path) {
    return path.toString().replace(/\/$/, "").replace(/^\//, "");
  },
  add: function (re, handler) {
    if (typeof re === "function") {
      handler = re;
      re = "";
    }
    this.routes.push({ re: re, handler: handler });
    return this;
  },
  check: function (f) {
    var fragment = f || this.getFragment();
    for (var i = 0; i < this.routes.length; i++) {
      var match = fragment.match(this.routes[i].re);
      if (match) {
        match.shift();
        this.routes[i].handler.apply({}, match);
        return this;
      }
    }
    return this;
  },
  listen: function () {
    var self = this;
    var current = self.getFragment();
    var fn = function () {
      if (current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },
  navigate: function (path) {
    path = path ? path : "";
    if (this.mode === "history") {
      history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href =
        window.location.href.replace(/#(.*)$/, "") + "#" + path;
    }
    return this;
  },
};

// Simple route addition helper function
function addRoute(path, handler) {
  Router.add(path, handler);
}

// Function to load HTML page dynamically
function loadPage(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
    })
    .catch((err) => {
      console.warn("Error loading page:", err);
      document.getElementById("app").innerHTML = "<h1>Page not found!</h1>";
    });
}
