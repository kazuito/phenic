import { auth } from "@/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  if (!req.auth && path !== "/" ) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|signin|api).*)"],
};
