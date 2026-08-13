import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const propertyFolders = ["mfsv1633", "r5011201", "r5019220", "r5395735", "r5395939", "r5421445", "r5457370"];
const expectedGallery = ["01.webp", "02.webp", "03.webp", "04.webp"];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : [join(directory, entry.name)]));
  return files.flat();
}

test("every property gallery has four optimized real images", async () => {
  for (const folder of propertyFolders) {
    const directory = join(process.cwd(), "public", "images", "properties", folder);
    assert.deepEqual((await readdir(directory)).sort(), expectedGallery, `${folder} must contain the complete optimized gallery`);
    for (const image of expectedGallery) {
      const details = await stat(join(directory, image));
      assert.ok(details.size > 10_000, `${folder}/${image} appears empty`);
      assert.ok(details.size < 600_000, `${folder}/${image} exceeds the delivery budget`);
    }
  }
});

test("application source never references retired JPEG assets", async () => {
  const files = (await sourceFiles(join(process.cwd(), "app"))).filter((file) => /\.(?:ts|tsx|css)$/.test(file));
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
  assert.equal(contents.some((source) => /\/images\/[^\s"')]+\.jpg/i.test(source)), false);
});
