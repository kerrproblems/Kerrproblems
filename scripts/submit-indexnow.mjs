const host = "kerrproblems.com";
const key = "bf8d4e25d44d42a3ba48f3dd94c1bb26";
const keyLocation = `https://${host}/${key}.txt`;

const requestedPaths = process.argv.slice(2);
const paths = requestedPaths.length
  ? requestedPaths
  : [
      "/",
      "/about",
      "/formal-verification",
      "/problems/K-505",
      "/problems/K-608",
      "/contributors/rahim-iqbal",
    ];
const urlList = paths.map((path) => new URL(path, `https://${host}`).toString());

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed (${response.status}): ${body}`);
}

console.log(`Submitted ${urlList.length} URL(s) to IndexNow (${response.status}).`);
