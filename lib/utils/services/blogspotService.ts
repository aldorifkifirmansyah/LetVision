const BLOG_ID = "2454819260619917191";
const API_KEY = "rahasia";


export interface BlogArticle {
  id: string;
  title: string;
  url: string;
  published: string;
  content: string;
  author: {
    id: string;
    displayName: string;
  };
}

export async function fetchBlogArticles(): Promise<BlogArticle[]> {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json.items) {
      return [];
    }

    const articles = json.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      published: item.published,
      content: item.content,
      author: {
        id: item.author.id,
        displayName: item.author.displayName,
      },
    }));

    return articles;
  } catch (error) {
    console.error("Gagal fetch artikel Blogspot:", error);
    return [];
  }
}
