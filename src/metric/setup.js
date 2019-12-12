const url = require("url");
const http = require("http");
const express = require("express");
const promBundle = require("express-prom-bundle");
const listEndpoints = require("express-list-endpoints");
const promClient = require("prom-client");
const UrlPattern = require("url-pattern");

let allRoutes = [];

const insertMiddleware = (app, option = {}) => {
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    autoregister: false,
    buckets: [0.03, 0.3, 1, 1.5, 3, 5, 10],

    normalizePath: (req, opts) => {
      if (option.normalizePath === false) {
        return req.url;
      }

      let pattern = null;
      let path = url.parse(req.originalUrl || req.url).pathname;

      allRoutes.some(route => {
        // Method matches
        if (route.methods.indexOf(req.method) !== -1) {
          if (path.endsWith("/")) {
            const removeTrailingPath = path.replace(/\/$/, "");
            if (route.path.match(removeTrailingPath)) {
              pattern = route.pattern;
              return true;
            }
          }

          if (route.path.match(path)) {
            pattern = route.pattern;
            return true;
          }
        }
        return false;
      });

      return pattern || path;
    }
  });

  app.use(metricsMiddleware);
};

const setupMetricService = () => {
  // Setup server on a second port to display metrics
  const metricApp = express();
  const metricServer = http.createServer(metricApp);
  metricServer.listen(9991, "127.0.0.1", () => {
    console.log(`Metrics server listening on ${9991}`);
  });

  metricApp.use("/metrics", async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(promClient.register.metrics());
  });
};

const captureAllRoutes = app => {
  allRoutes = listEndpoints(app);
  allRoutes = allRoutes.filter(
    route => route.path !== "/*" && route.path !== "*"
  );

  allRoutes.forEach(route => {
    route.pattern = route.path;

    if (route.path.endsWith("/")) {
      route.path = route.path.replace(/\/$/, "(/)");
    }

    route.path = new UrlPattern(route.path, {
      segmentNameCharset: "a-zA-Z0-9_-"
    });
  });
};

module.exports = { insertMiddleware, setupMetricService, captureAllRoutes };
