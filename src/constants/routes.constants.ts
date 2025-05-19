/**
 * Application route constants
 * Use these constants for route paths to ensure consistency across the application
 */

// Type for route constants with withSlash method
type RouteWithSlash = string & { withSlash: () => string };

// Function to create a route with withSlash method
const createRoute = (path: string): RouteWithSlash => {
  // Remove leading slash if it exists
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Add withSlash method to the string
  const routeWithSlash = cleanPath as RouteWithSlash;
  routeWithSlash.withSlash = function () {
    return `/${this}`;
  };

  return routeWithSlash;
};

export const AppRoutes = {
  // Auth routes
  LOGIN: createRoute("login"),

  // Main application routes
  HOME: createRoute(""),
  CHAT_ASSISTANT: createRoute("chat-assistant"),
  USERS: createRoute("users"),
  SCHOOLS: createRoute("schools"),

  // Error routes
  NOT_FOUND: createRoute("404"),
};
