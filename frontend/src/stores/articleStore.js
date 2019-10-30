// @flow

import axios from 'axios';
import { Article, ArticleBase } from '../utils/Article';
import { sharedComponentData } from 'react-simplified';

const placeholder = new Article(
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

const empty = new Article(
    1,
    1,
    '',
    'https://i.imgur.com/puQs66y.png',
    '',
    '',
    `*Begin your article with an ingress*
    
## Use headers of level 2 and below

write some **good** text`,
    '',
    new Date(),
    null,
    2,
    2.3
  );

class ArticleStore {
  // TODO make this have an effect
  loadingArticle: boolean = false;
  currentArticle: Article = placeholder;
  articles: ArticleBase[] = [];
  categoryMap: Map<string, ArticleBase[]> = new Map<string, ArticleBase[]>([
    ['news', []],
    ['culture', []],
    ['science', []],
    ['politics', []]
  ]);

  clearArticle() {
    this.currentArticle = empty;
  }

  getArticle(id: number) {
    return axios
      .get<Article>('/articles/' + id)
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
          new Date(Date.parse(upload_time)),
          update_time ? new Date(Date.parse(update_time)) : null,
          importance,
          rating
        );
        return result;
      });
  }

  addArticle(article: Article) {
    return axios.post('/articles/', {
      user_id: article.authorID,
      title: article.title,
      picture_path: article.picturePath,
      picture_alt: article.pictureAlt,
      picture_caption: article.pictureCapt,
      content: article.text,
      importance: article.importance,
      category: article.category
    }).then(response => response.data.id);
  }

  getFrontPage(): Promise<ArticleBase[]> {
    return axios
      .get<ArticleBase[]>('/articles/front_page')
      .then(response => {
        this.articles.splice(0, this.articles.length);
        this.articles.push(...this.toArticleArray(response.data));
      });
  }

  getCategory(category: string): Promise<ArticleBase[]> {
    return axios
      .get<ArticleBase[]>('/articles/categories/' + category)
      .then(response => {
        const array = this.categoryMap.get(category);
        if (array) {
          array.splice(0, array.length);
          array.push(...this.toArticleArray(response.data));
        }
      })
      /*.catch(e => {
        // this is temporary crap
        this.articles.splice(0, this.articles.length);
        throw e;
      })*/
  }

  setArticles(result: []) {
    this.articles.splice(0, this.articles.length);
    const newOnes: ArticleBase[] = result.map(e => {
      const {article_id, title, picture_path, picture_alt, category} = e;
      return new ArticleBase(article_id, title, picture_path, picture_alt, category);
    });
    this.articles.push(...newOnes);
  }

  toArticleArray(result: []): ArticleBase[] {
    return result.map(e => {
      const {article_id, title, picture_path, picture_alt, category} = e;
      return new ArticleBase(article_id, title, picture_path, picture_alt, category);
    });
  }
}

export const articleStore = sharedComponentData(new ArticleStore());
