// @flow

import axios from 'axios';
import { Article } from './Article';
import { sharedComponentData } from 'react-simplified';

class ArticleService {
  currentArticle: Article = new Article(
    1,
    'Fridge Found Floating in Space',
    `After its long flight through the rings of Saturn, a fridge of mysterious
              origin was caught by a spacewalking astronaut on the ISS and brought to
              Earth for inspection. Inside were the remains of an unknown biological life
              form - and a pile of ancient floppy disks. The floppies contained impressive
              amounts of text - newspaper articles, essays, even a few poems. Here are a
              few snippets from the fridge's collection.`,
    'https://i.imgur.com/puQs66y.png',
    'Fridge floating in space',
    'The infamous space-floating fridge',
    `### Space Cows Demand We Go Vegan  
Yesterday, a fleet of extrasolar ships approached Earth, bearing an ultimatum.
If we do not stop eating meat and return all our livestock to nature, our entire civilization will be eradicated.
The species behind this harsh request look almost exactly like the cows of humanity's home world, but their intelligence is on a whole other level, perhaps exceeding ours.
Most governments in the solar system have already stated that they perceive this threat as very real, some adding that they will take immediate action to enforce a meat ban.`,
    'news',
    new Date(),
    'The Fridge',
    2.3
  );
  articles: Article[] = [this.currentArticle];

  getArticle() {
    return setTimeout(() => console.log('did get article, totes'), 200);
  }
}

export const articleService = sharedComponentData(new ArticleService());
