export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname.toLowerCase() !== "home-fitness-finds.pages.dev") {
    return context.next();
  }

  url.protocol = "https:";
  url.hostname = "fitnessfindshq.com";
  url.port = "";

  return Response.redirect(url.toString(), 301);
}
