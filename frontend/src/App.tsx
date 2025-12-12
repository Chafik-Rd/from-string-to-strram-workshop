import {
  createRootRoute,
  createRouter,
  Link,
  Outlet,
  Route,
  RouterProvider,
} from "@tanstack/react-router";
import { StreamJSONLine } from "./Stream-json-line";
import { StreamText } from "./Stream-text";
import { StreamSSE } from "./Stream-sse";
import { StreamSSE2 } from "./Stream-sse2";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="flex justify-center gap-10 p-5">
        <Link to="/">
          <button className="p-2 bg-blue-200 rounded-xl">Stream Text</button>
        </Link>
        <Link to="/stream-json-line">
          <button className="p-2 bg-orange-200 rounded-xl">
            Stream JSON line
          </button>
        </Link>
        <Link to="/stream-sse">
          <button className="p-2 bg-green-200 rounded-xl">
            Stream SSE(EventSource)
          </button>
        </Link>
        <Link to="/stream-sse2">
          <button className="p-2 bg-green-200 rounded-xl">
            Stream SSE(fetch)
          </button>
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  new Route({
    getParentRoute: () => rootRoute,
    path: "/stream-json-line",
    component: StreamJSONLine,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: StreamText,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/stream-sse",
    component: StreamSSE,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/stream-sse2",
    component: StreamSSE2,
  }),
]);

const router = createRouter({
  routeTree,
});
// 🔥 IMPORTANT: ต้อง register types
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return <RouterProvider router={router} />;
}

export default App;
