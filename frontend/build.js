const fs = require("fs-extra");
const esbuild = require("esbuild");
const gl = require("glob");

const prod = process.env.NODE_ENV
  ? process.env.NODE_ENV === "production"
  : false;

async function glob(globString, options) {
  return new Promise((resolve, reject) => {
    gl(globString, options, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

async function main() {
  if (prod) {
    console.log("--- Production Build ---");
  }

  await Promise.all(
    (await glob("src/*.html")).map((f) => fs.copy(f, f.replace("src", "dist")))
  );

  await fs.copy("assets", "dist/assets");

  await esbuild.build({
    entryPoints: ["src/js/game.ts"],
    bundle: true,
    minify: prod,
    define: {
      "process.env.NODE_ENV": prod ? "'production'" : "'development'",
      HOSTNAME: "'localhost'",
      PORT: 4334,
    },
    sourcemap: !prod,
    target: ["chrome58", "firefox57"],
    outfile: "dist/bundle.min.js",
  });
}

main().catch(console.error);
