// @flow

export class ArticleBase {
  id: number;
  title: string;
  picturePath: string;
  pictureAlt: string;
  category: string;
  date: Date;
  rating: number;

  constructor(id: number, title: string, picturePath: string, pictureAlt: string, category: string, date: Date, rating: number) {
    this.id = id;
    this.title = title;
    this.picturePath = picturePath;
    this.pictureAlt = pictureAlt;
    this.category = category;
    this.date = date;
    this.rating = rating;
  }
}

export class Article {
  id: number;
  title: string;
  ingress: string;
  picturePath: string;
  pictureAlt: string;
  pictureCapt: string;
  text: string;
  category: string;
  date: Date;
  author: string; // TODO plz be author obj or somthing
  rating: number;

  constructor(id: number, title: string, ingress: string, picturePath: string, pictureAlt: string, pictureCapt: string, text: string, category: string, date: Date, author: string, rating: number) {
    this.id = id;
    this.title = title;
    this.ingress = ingress;
    this.picturePath = picturePath;
    this.pictureAlt = pictureAlt;
    this.pictureCapt = pictureCapt;
    this.text = text;
    this.category = category;
    this.date = date;
    this.author = author;
    this.rating = rating;
  }
}
