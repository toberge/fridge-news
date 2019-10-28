// @flow

import axios from 'axios';
import { Article, ArticleBase } from './utils/Article';
import { sharedComponentData } from 'react-simplified';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: { 'Access-Control-Allow-Origin': 'http://localhost:8080/' }
});

class ArticleService {
  currentArticle: Article = new Article(
    1,
    1,
    'Fridge Found Floating in Space',
    'https://i.imgur.com/puQs66y.png',
    'Fridge floating in space',
    'The infamous space-floating fridge',
    `*After its long flight through the rings of Saturn, a fridge of mysterious
origin was caught by a spacewalking astronaut on the ISS and brought to
Earth for inspection. Inside were the remains of an unknown biological life
form - and a pile of ancient floppy disks. The floppies contained impressive
amounts of text - newspaper articles, essays, even a few poems. Here are a
few snippets from the fridge's collection.*
### Space Cows Demand We Go Vegan  
Yesterday, a fleet of extrasolar ships approached Earth, bearing an ultimatum.
If we do not stop eating meat and return all our livestock to nature, our entire civilization will be eradicated.
The species behind this harsh request look almost exactly like the cows of humanity's home world, but their intelligence is on a whole other level, perhaps exceeding ours.
Most governments in the solar system have already stated that they perceive this threat as very real, some adding that they will take immediate action to enforce a meat ban.`,
    'news',
    new Date(),
    null,
    1,
    2.3
  );
  articles: ArticleBase[] = [];

  getArticle(id: number) {
    return axiosInstance
      .get<Article>('http://localhost:8080/articles/' + id)
      .then(response => response.data)
      .then(result => {
        const {
          article_id,
          user_id,
          title,
          picture_path,
          picture_alt,
          picture_caption,
          content,
          upload_time,
          update_time,
          importance,
          category,
          rating
        } = result;
        this.currentArticle = new Article(
          article_id,
          user_id,
          title,
          picture_path,
          picture_alt,
          picture_caption,
          content,
          category,
          new Date(upload_time),
          update_time ? new Date(update_time) : null,
          importance,
          rating
        );
        return result;
      });
  }

  getFrontPage(): Promise<ArticleBase[]> {
    return axiosInstance
      .get<ArticleBase[]>('/articles/front_page')
      .then(response => this.setArticles(response.data));
  }

  getCategory(category: string): Promise<ArticleBase[]> {
    return axiosInstance
      .get<ArticleBase[]>('/articles/categories/' + category)
      .then(response => this.setArticles(response.data));
  }

  setArticles(result: []) {
    this.articles = result.map(e => {
      const {article_id, title, picture_path, picture_alt, category} = e;
      return new ArticleBase(article_id, title, picture_path, picture_alt, category);
    });
  }
}

export const articleService = sharedComponentData(new ArticleService());
