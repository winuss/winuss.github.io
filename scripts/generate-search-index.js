// scripts/generate-search-index.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

function cleanMarkdown(raw) {
  if (!raw) return '';
  return (
    raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/~~~[\s\S]*?~~~/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/^>\s?/gm, '')
      .replace(/^[\s-]*[-+*]\s+/gm, '')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

async function generate() {
  const srcDir = path.join(process.cwd(), 'src', 'posts');
  const publicDir = path.join(process.cwd(), 'public');
  const outPath = path.join(publicDir, 'search-index.json');

  const mdxFiles = glob.sync(path.join(srcDir, '**/content.mdx'));

  const posts = [];
  for (const mdxPath of mdxFiles) {
    const dir = path.dirname(mdxPath);
    const relativeDir = path.relative(srcDir, dir).split(path.sep).join('/');
    const segments = relativeDir.split('/');
    const categoryPath = segments[0];
    const slug = segments[segments.length - 1];
    const url = `/${slug}`;

    const file = await fs.readFile(mdxPath, 'utf8');
    const { data, content } = matter(file);

    posts.push({
      url,
      slug,
      categoryPath,
      title: data.title || '',
      desc: data.desc || data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date || '',
      thumbnail: data.thumbnail || '',
      // 검색 정확도를 위해 원문을 포함하되, 클라이언트에서 필요시 축약 사용
      content,
      // 가벼운 검색 텍스트도 제공
      searchText: cleanMarkdown(`${data.title || ''}\n${data.desc || ''}\n${content || ''}`),
    });
  }

  await fs.ensureDir(publicDir);
  await fs.writeJson(outPath, { generatedAt: new Date().toISOString(), count: posts.length, posts }, { spaces: 2 });
  console.log(`✓ search-index.json generated: ${posts.length} posts`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});


