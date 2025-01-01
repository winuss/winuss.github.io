// scripts/copy-images.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function processPostImages() {
  const srcDir = path.join(process.cwd(), 'src', 'posts');
  const destDir = path.join(process.cwd(), 'public', 'posts');

  // 1. 모든 MDX 파일 찾기
  const mdxFiles = glob.sync(path.join(srcDir, '**/content.mdx'));

  // 2. 모든 이미지 파일 찾기
  const imageFiles = glob.sync(path.join(srcDir, '**/*.{png,jpg,jpeg,gif,webp,svg}'));

  // 3. 이미지 파일 복사
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(srcDir, imagePath);
    const destPath = path.join(destDir, relativePath);

    try {
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(imagePath, destPath);
      console.log(`✓ Copied: ${relativePath}`);
    } catch (err) {
      console.error(`✗ Error copying ${relativePath}:`, err);
    }
  }

  // 4. MDX 파일 내 이미지 경로 변환
  for (const mdxPath of mdxFiles) {
    try {
      const content = await fs.readFile(mdxPath, 'utf8');
      const postDir = path.relative(srcDir, path.dirname(mdxPath));

      // 상대 경로를 절대 경로로 변환
      const modifiedContent = content.replace(
        /!\[(.*?)\]\((\.\/.*?)\)/g,
        (match, alt, relativePath) => {
          const imagePath = relativePath.replace('./', `/posts/${postDir}/`);
          return `![${alt}](${imagePath})`;
        }
      );

      await fs.writeFile(mdxPath, modifiedContent);
      console.log(`✓ Updated paths in: ${postDir}/content.mdx`);
    } catch (err) {
      console.error(`✗ Error updating ${mdxPath}:`, err);
    }
  }

  console.log('\n✨ All images copied and paths updated successfully');
}

processPostImages().catch(console.error);
