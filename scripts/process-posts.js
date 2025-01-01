// scripts/process-posts.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

async function processPostImages() {
  const srcDir = path.join(process.cwd(), 'src', 'posts');
  const destDir = path.join(process.cwd(), 'public', 'posts');

  // 1. 모든 MDX 파일 찾기
  const mdxFiles = glob.sync(path.join(srcDir, '**/content.mdx'));
  console.log(`Found ${mdxFiles.length} MDX files`);

  // 2. 모든 이미지 파일 찾기
  const imageFiles = glob.sync(path.join(srcDir, '**/*.{png,jpg,jpeg,gif,webp,svg}'));
  console.log(`Found ${imageFiles.length} image files`);

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
      const fileContent = await fs.readFile(mdxPath, 'utf8');
      const postDir = path.relative(srcDir, path.dirname(mdxPath));

      const { data, content } = matter(fileContent);

      // thumbnail 경로 변환
      if (data.thumbnail && data.thumbnail.startsWith('./')) {
        data.thumbnail = `/posts/${postDir}/${data.thumbnail.replace('./', '')}`;
      }

      // MDX 파일 내 이미지 경로 변환
      const modifiedContent = content
        .replace(
          /!\[(.*?)\]\(((?:\.\/)?[^/)]+\.(?:png|jpg|jpeg|gif|webp|svg))\)/g,
          (match, alt, imagePath) => {
            if (imagePath.startsWith('/')) {
              return match;
            }
            const absolutePath = imagePath.replace(/^\.?\/?(.*?)$/, `/posts/${postDir}/$1`);
            return `![${alt}](${absolutePath})`;
          }
        )
        .trim(); // 내용의 앞뒤 공백 제거

      // front matter 형식 유지
      const frontMatter = Object.entries(data)
        .map(([key, value]) => {
          if (key === 'date' && value instanceof Date) {
            return `${key}: ${value.toISOString().split('T')[0]}`;
          }
          if (typeof value === 'string') {
            return `${key}: ${value}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');

      // front matter와 content 사이 간격 표준화
      const updatedFileContent = `---\n${frontMatter}\n---\n\n${modifiedContent}`;

      await fs.writeFile(mdxPath, updatedFileContent);
      console.log(`✓ Updated paths in: ${postDir}/content.mdx`);
    } catch (err) {
      console.error(`✗ Error updating ${mdxPath}:`, err);
    }
  }

  console.log('\n✨ All images copied and paths updated successfully');
}

processPostImages().catch(console.error);
