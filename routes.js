// Event listeners to handle page navigation through buttons
// Configure Router to use hash mode
Router.config({ mode: "hash" });

// Define Routes with exact regex matches
addRoute(/^$/, function () {
  // Matches empty fragment (home)
  loadPage("pages/home.html");
});

addRoute(/^about$/, function () {
  // Matches exactly "about"
  loadPage("pages/about.html");
});

// Error handling for unknown routes (404)
addRoute(function () {
  loadPage("pages/404.html");
});

// Start listening to hash changes
Router.listen();

// Check initial route when page loads
Router.check();
