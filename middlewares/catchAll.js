const catchAll = (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else if (req.accepts("html")) {
    res.send("404 Not Found");
  } else {
    res.type("txt").send("404 Not Found");
  }
};

module.exports = catchAll;
