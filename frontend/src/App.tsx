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

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="flex justify-center gap-10 p-5">
        <Link to="/">
          <button className="p-2 bg-blue-200 rounded-xl">Stream Text</button>
        </Link>
        <Link to="/stream-json-line">
          <button className="p-2 bg-orange-200 rounded-xl">Stream JSON line</button>
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
