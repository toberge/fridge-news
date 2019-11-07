// @flow

import axios from 'axios';
import { Article, ArticleBase } from '../data/Article';
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
    '',
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
  // won't make loading multiple articles necessitate showing a loading page,
  // it's better to show a not-yet-updated list than to show *the wrong article*
  loadingArticle: boolean = false;
  currentArticle: Article = placeholder;
  articles: ArticleBase[] = [];
  categoryMap: Map<string, ArticleBase[]> = new Map<string, ArticleBase[]>([
    ['news', []],
    ['culture', []],
    ['science', []],
    ['politics', []]
  ]);

  categories: string[] = ['news', 'culture', 'science', 'politics', 'blablabla'];

  // wow shit why must I be forced to do this...
  getCategories() {
    return axios.get('/articles/categories/')
      .then(response => response.data)
      .then(strings => {
        // replace old array (if anything lives there)
        const countBefore = this.categories.length;
        this.categories.push(strings);
        this.categories.splice(0, countBefore);
        // add to hashmap of cached categories
        strings.forEach(s => {
          if (!this.categoryMap.get(s)) {
            this.categoryMap.set(s, []);
          }
        })
      })
  }

  clearArticle() {
    Object.assign(this.currentArticle, { ...empty });
  }

  getArticle(id: number) {
    this.loadingArticle = true;
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
        this.loadingArticle = false;
        return result;
      });
  }

  addArticle(): Promise<number | void> {
    const article = this.currentArticle;
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

  updateArticle(): Promise<boolean | void> {
    const article = this.currentArticle;
    return axios.put('/articles/' + article.id, {
      title: article.title,
      picture_path: article.picturePath,
      picture_alt: article.pictureAlt,
      picture_caption: article.pictureCapt,
      content: article.text,
      importance: article.importance,
      category: article.category
    }).then(response => response.status === 200);
  }

  deleteArticle(): Promise<boolean> {
    return axios.delete(`/articles/${this.currentArticle.id}`)
      .then(response => response.status === 200);
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

  toArticleArray(result: []): ArticleBase[] {
    return result.map(e => {
      const {article_id, title, picture_path, picture_alt, category} = e;
      return new ArticleBase(article_id, title, picture_path, picture_alt, category);
    });
  }
}

export const articleStore = sharedComponentData(new ArticleStore());
