const sharp = require('sharp');

async function splitSword() {
  const meta = await sharp('indieSWORD.gif').metadata();
  
  // 1 row, 4 columns
  const cols = 4;
  const rows = 1;
  const w = Math.floor(meta.width / cols);
  const h = meta.height;
  
  let i = 1;
  for (let col = 0; col < cols; col++) {
    await sharp('indieSWORD.gif', { animated: true })
      .extract({ left: col * w, top: 0, width: w, height: h })
      .gif()
      .toFile(`sword_${i}.gif`);
    i++;
  }
  console.log('Split swords correctly (1x4 grid)');
}

async function splitGuns() {
  const meta = await sharp('indieguns.gif').metadata();
  
  // 4 rows, 3 columns
  const cols = 3;
  const rows = 4;
  const h = Math.floor(meta.height / rows); // 800 / 4 = 200
  
  let i = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.round(col * meta.width / cols);
      const right = Math.round((col + 1) * meta.width / cols);
      const w = right - left;
      
      await sharp('indieguns.gif', { animated: true })
        .extract({ left: left, top: row * h, width: w, height: h })
        .gif()
        .toFile(`gun_${i}.gif`);
      i++;
    }
  }
  console.log('Split guns correctly (4x3 grid)');
}

async function run() {
  await splitSword();
  await splitGuns();
}

run().catch(console.error);
